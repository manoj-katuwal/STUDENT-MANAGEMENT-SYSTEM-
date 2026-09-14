import AppError from "../../shared/utils/error/AppError.js";
import { findAcademicYearById, findAcademicYearsForExport } from "../academicYear/academicYear.repository.js";
import { findClassById, findClassesForExport } from "../classes/class.repository.js";
import { countFeeStructures, createFeeStructure, findFeeStructureByCombination, findFeeStructureById, findFeeStructures, findFeeStructuresForExport, getFeeStructureStats, updateFeeStructure } from "./feeStructure.repository.js";

export const createFeeStructureService = async (feeStructureData) => {
  const { academicYearId, classId, feeType, amount } = feeStructureData;

  if (!academicYearId) {
    throw new AppError("Academic year is required", 400);
  }

  if (!classId) {
    throw new AppError("Class is required", 400);
  }

  if (!feeType) {
    throw new AppError("Fee type is required", 400);
  }

  if (amount === undefined || amount === null) {
    throw new AppError("Fee amount is required", 400);
  }

  if (amount < 0) {
    throw new AppError("Fee amount cannot be negative", 400);
  }

  const academicYear = await findAcademicYearById(academicYearId);

  if (!academicYear) {
    throw new AppError("Academic year not found", 404);
  }

  if (academicYear.status === "INACTIVE") {
    throw new AppError(
      "Cannot create fee structure for an inactive academic year",
      400,
    );
  }

  const classRecord = await findClassById(classId);

  if (!classRecord) {
    throw new AppError("Class not found", 404);
  }

  if (classRecord.status === "INACTIVE") {
    throw new AppError(
      "Cannot create fee structure for an inactive class",
      400,
    );
  }

  const existingFeeStructure = await findFeeStructureByCombination({
    academicYearId,
    classId,
    feeType,
  });

  if (existingFeeStructure) {
    throw new AppError(
      "Fee structure for this academic year, class and fee type already exists",
      400,
    );
  }

  return await createFeeStructure(feeStructureData);
};

export const getFeeStructuresService = async (
  page = 1,
  limit = 10,
  academicYearId = "",
  classId = "",
  feeType = "",
  status = "",
  search = "",
) => {
  const skip = (page - 1) * limit;

  const filter = {};

  if (academicYearId) {
    filter.academicYearId = academicYearId;
  }

  if (classId) {
    filter.classId = classId;
  }

  if (feeType) {
    filter.feeType = feeType;
  }

  if (status) {
    filter.status = status;
  }

  if (search) {
    const [academicYears, classes] = await Promise.all([
      findAcademicYearsForExport({
        name: { $regex: search, $options: "i" },
      }),
      findClassesForExport({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { code: { $regex: search, $options: "i" } },
        ],
      }),
    ]);

    filter.$or = [
      { academicYearId: { $in: academicYears.map((year) => year._id) } },
      { classId: { $in: classes.map((classRecord) => classRecord._id) } },
    ];
  }

  const [feeStructures, total] = await Promise.all([
    findFeeStructures({
      filter,
      skip,
      limit,
    }),
    countFeeStructures(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    feeStructures,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const getFeeStructureByIdService = async (feeStructureId) => {
  const feeStructure = await findFeeStructureById(feeStructureId);

  if (!feeStructure) {
    throw new AppError("Fee structure not found", 404);
  }

  return feeStructure;
};

export const getFeeStructureStatsService = async () => {
  return await getFeeStructureStats();
};

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return "";

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

const getExportFilter = async ({
  search = "",
  academicYearId = "",
  classId = "",
  feeType = "",
  status = "",
} = {}) => {
  const filter = {};
  const cleanSearch = typeof search === "string" ? search.trim() : "";

  if (academicYearId) filter.academicYearId = academicYearId;
  if (classId) filter.classId = classId;
  if (feeType) filter.feeType = feeType;
  if (status) filter.status = status;

  if (cleanSearch) {
    const [academicYears, classes] = await Promise.all([
      findAcademicYearsForExport({
        name: { $regex: cleanSearch, $options: "i" },
      }),
      findClassesForExport({
        $or: [
          { name: { $regex: cleanSearch, $options: "i" } },
          { code: { $regex: cleanSearch, $options: "i" } },
        ],
      }),
    ]);

    filter.$or = [
      { academicYearId: { $in: academicYears.map((year) => year._id) } },
      { classId: { $in: classes.map((classRecord) => classRecord._id) } },
    ];
  }

  return filter;
};

export const getFeeStructuresForExportService = async (filters = {}) => {
  const feeStructures = await findFeeStructuresForExport(
    await getExportFilter(filters),
  );

  const headers = [
    "Academic Year",
    "Class Name",
    "Class Code",
    "Fee Type",
    "Amount",
    "Status",
    "Created At",
    "Updated At",
  ];

  const rows = feeStructures.map((feeStructure) =>
    [
      feeStructure.academicYearId?.name,
      feeStructure.classId?.name,
      feeStructure.classId?.code,
      feeStructure.feeType,
      feeStructure.amount,
      feeStructure.status,
      feeStructure.createdAt?.toISOString(),
      feeStructure.updatedAt?.toISOString(),
    ]
      .map(escapeCsvValue)
      .join(","),
  );

  return [headers.join(","), ...rows].join("\r\n");
};

export const updateFeeStructureService = async (feeStructureId, updateData) => {
  const feeStructure = await findFeeStructureById(feeStructureId);

  if (!feeStructure) {
    throw new AppError("Fee structure not found", 404);
  }

  const academicYearId =
    updateData.academicYearId || feeStructure.academicYearId;

  const classId = updateData.classId || feeStructure.classId;

  const feeType = updateData.feeType || feeStructure.feeType;

  const amount = updateData.amount ?? feeStructure.amount;

  if (amount < 0) {
    throw new AppError("Fee amount cannot be negative", 400);
  }

  if (updateData.academicYearId) {
    const academicYear = await findAcademicYearById(updateData.academicYearId);

    if (!academicYear) {
      throw new AppError("Academic year not found", 404);
    }

    if (academicYear.status === "INACTIVE") {
      throw new AppError(
        "Cannot assign fee structure to an inactive academic year",
        400,
      );
    }
  }

  if (updateData.classId) {
    const classRecord = await findClassById(updateData.classId);

    if (!classRecord) {
      throw new AppError("Class not found", 404);
    }

    if (classRecord.status === "INACTIVE") {
      throw new AppError(
        "Cannot assign fee structure to an inactive class",
        400,
      );
    }
  }

  if (updateData.academicYearId || updateData.classId || updateData.feeType) {
    const existingFeeStructure = await findFeeStructureByCombination({
      academicYearId,
      classId,
      feeType,
    });

    if (
      existingFeeStructure &&
      existingFeeStructure._id.toString() !== feeStructureId.toString()
    ) {
      throw new AppError(
        "Fee structure for this academic year, class and fee type already exists",
        400,
      );
    }
  }

  return await updateFeeStructure(feeStructureId, updateData);
};

export const deactivateFeeStructureService = async (feeStructureId) => {
  const feeStructure = await findFeeStructureById(feeStructureId);

  if (!feeStructure) {
    throw new AppError("Fee structure not found", 404);
  }

  if (feeStructure.status === "INACTIVE") {
    throw new AppError("Fee structure is already inactive", 400);
  }

  return await updateFeeStructure(feeStructureId, {
    status: "INACTIVE",
  });
};

export const activateFeeStructureService = async (feeStructureId) => {
  const feeStructure = await findFeeStructureById(feeStructureId);

  if (!feeStructure) {
    throw new AppError("Fee structure not found", 404);
  }

  if (feeStructure.status === "ACTIVE") {
    throw new AppError("Fee structure is already active", 400);
  }

  return await updateFeeStructure(feeStructureId, {
    status: "ACTIVE",
  });
};
