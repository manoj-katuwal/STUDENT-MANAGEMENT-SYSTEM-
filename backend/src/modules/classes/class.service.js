import AppError from "../../shared/utils/error/AppError.js";
import {
  createClass,
  findClassByName,
  findClassByCode,
  findClasses,
  findClassById,
  updateClass,
  updateClassStatus,
  countClasses,
  getClassStats,
  findClassesForExport,
} from "./class.repository.js";

export const createClassService = async (classData) => {
  const existingClassByName = await findClassByName(classData.name);

  if (existingClassByName) {
    throw new AppError("Class with this name already exists", 400);
  }

  const existingClassByCode = await findClassByCode(classData.code);

  if (existingClassByCode) {
    throw new AppError("Class with this code already exists", 400);
  }

  const classRecord = await createClass(classData);

  return classRecord;
};

export const getClassesService = async (
  page = 1,
  limit = 10,
  search = "",
  status = "",
) => {
  const skip = (page - 1) * limit;

  const filter = {};

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        code: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (status) {
    filter.status = status;
  }

  const [classes, total] = await Promise.all([
    findClasses(filter, skip, limit),
    countClasses(filter),
  ]);

  return {
    classes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getClassByIdService = async (classId) => {
  const classRecord = await findClassById(classId);

  if (!classRecord) {
    throw new AppError("Class not found", 404);
  }

  return classRecord;
};

export const updateClassService = async (classId, updateData) => {
  const classRecord = await findClassById(classId);

  if (!classRecord) {
    throw new AppError("Class not found", 404);
  }

  if (updateData.name && updateData.name !== classRecord.name) {
    const existingClass = await findClassByName(updateData.name);

    if (existingClass) {
      throw new AppError("Class with this name already exists", 400);
    }
  }

  if (updateData.code && updateData.code !== classRecord.code) {
    const existingClass = await findClassByCode(updateData.code);

    if (existingClass) {
      throw new AppError("Class with this code already exists", 400);
    }
  }

  const updatedClass = await updateClass(classId, updateData);

  return updatedClass;
};

export const updateClassStatusService = async (classId, status) => {
  const classRecord = await findClassById(classId);

  if (!classRecord) {
    throw new AppError("Class not found", 404);
  }

  if (classRecord.status === status) {
    throw new AppError(`Class is already ${status.toLowerCase()}`, 400);
  }

  return await updateClassStatus(classId, status);
};

export const getClassStatsService = async () => {
  const stats = await getClassStats();

  return stats;
};

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

const formatDateSafe = (dateVal) => {
  if (!dateVal) return "";
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "";
    return d.toISOString();
  } catch {
    return "";
  }
};

const classToCsvRow = (classRecord) => {
  return [
    classRecord.name || "",
    classRecord.code || "",
    classRecord.status || "",
    formatDateSafe(classRecord.createdAt),
    formatDateSafe(classRecord.updatedAt),
  ]
    .map(escapeCsvValue)
    .join(",");
};

const generateClassesCsv = (classes) => {
  const headers = [
    "Class Name",
    "Class Code",
    "Status",
    "Created At",
    "Updated At",
  ];

  const rows = classes.map(classToCsvRow);

  return [headers.join(","), ...rows].join("\r\n");
};

export const getClassesForExportService = async ({
  search = "",
  status = "",
} = {}) => {
  const cleanSearch = typeof search === "string" ? search.trim() : "";
  const cleanStatus = typeof status === "string" ? status.trim() : "";

  const filter = {};

  if (cleanSearch) {
    filter.$or = [
      {
        name: {
          $regex: cleanSearch,
          $options: "i",
        },
      },
      {
        code: {
          $regex: cleanSearch,
          $options: "i",
        },
      },
    ];
  }

  if (cleanStatus) {
    filter.status = cleanStatus;
  }

  const classes = await findClassesForExport(filter);

  return generateClassesCsv(classes);
};
