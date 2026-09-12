import AppError from "../../shared/utils/error/AppError.js";
import {
  clearCurrentAcademicYear,
  countAcademicYears,
  createAcademicYear,
  findAcademicYearById,
  findAcademicYearByName,
  findAcademicYears,
  findAcademicYearsForExport,
  findCurrentAcademicYear,
  getAcademicYearStats,
  updateAcademicYear,
} from "./academicYear.repository.js";

const switchCurrentAcademicYear = async (academicYearId, updateData = {}) => {
  // No transactions — standalone MongoDB doesn't support them.
  // clearCurrentAcademicYear first, then set the new one as current.
  await clearCurrentAcademicYear();

  const updatedAcademicYear = await updateAcademicYear(academicYearId, {
    ...updateData,
    isCurrent: true,
    status: "ACTIVE",
  });

  return updatedAcademicYear;
};

export const createAcademicYearService = async (academicYearData) => {
  const { name, startDate, endDate, isCurrent } = academicYearData;
  const normalizedName = name?.trim();

  if (!normalizedName) {
    throw new AppError("Academic year name is required", 400);
  }

  if (!startDate || !endDate) {
    throw new AppError("Start date and end date are required", 400);
  }

  const parsedStartDate = new Date(startDate);
  const parsedEndDate = new Date(endDate);

  if (
    Number.isNaN(parsedStartDate.getTime()) ||
    Number.isNaN(parsedEndDate.getTime()) ||
    parsedStartDate >= parsedEndDate
  ) {
    throw new AppError("Start date must be before end date", 400);
  }

  const existingAcademicYear = await findAcademicYearByName(normalizedName);

  if (existingAcademicYear) {
    throw new AppError("Academic year with this name already exists", 400);
  }

  if (isCurrent === true) {
    const currentAcademicYear = await findCurrentAcademicYear();

    if (currentAcademicYear) {
      throw new AppError(
        "Another academic year is already marked as current",
        400,
      );
    }
  }

  return await createAcademicYear({ ...academicYearData, name: normalizedName });
};

export const getAcademicYearByIdService = async (academicYearId) => {
  const academicYear = await findAcademicYearById(academicYearId);

  if (!academicYear) {
    throw new AppError("Academic year not found", 404);
  }

  return academicYear;
};

export const getAcademicYearsService = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const filter = {};

  const [academicYears, total] = await Promise.all([
    findAcademicYears({
      filter,
      skip,
      limit,
    }),
    countAcademicYears(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    academicYears,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const getAcademicYearStatsService = async () => {
  return await getAcademicYearStats();
};

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return "";

  const stringValue = String(value);
  return /[",\r\n]/.test(stringValue)
    ? `"${stringValue.replace(/"/g, '""')}"`
    : stringValue;
};

const formatDateForCsv = (value) => {
  if (!value) return "";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
};

export const getAcademicYearsForExportService = async () => {
  const academicYears = await findAcademicYearsForExport();
  const headers = [
    "Academic Year",
    "Start Date",
    "End Date",
    "Status",
    "Current Year",
    "Created At",
    "Updated At",
  ];

  const rows = academicYears.map((academicYear) =>
    [
      academicYear.name,
      formatDateForCsv(academicYear.startDate),
      formatDateForCsv(academicYear.endDate),
      academicYear.status,
      academicYear.isCurrent ? "Yes" : "No",
      formatDateForCsv(academicYear.createdAt),
      formatDateForCsv(academicYear.updatedAt),
    ]
      .map(escapeCsvValue)
      .join(","),
  );

  return [headers.join(","), ...rows].join("\r\n");
};

export const updateAcademicYearService = async (academicYearId, updateData) => {
  const academicYear = await findAcademicYearById(academicYearId);

  if (!academicYear) {
    throw new AppError("Academic year not found", 404);
  }

  if (updateData.name) {
    const existingAcademicYear = await findAcademicYearByName(updateData.name);

    if (
      existingAcademicYear &&
      existingAcademicYear._id.toString() !== academicYearId.toString()
    ) {
      throw new AppError("Academic year with this name already exists", 400);
    }
  }

  const startDate = updateData.startDate || academicYear.startDate;
  const endDate = updateData.endDate || academicYear.endDate;

  if (new Date(startDate) >= new Date(endDate)) {
    throw new AppError("Start date must be before end date", 400);
  }

  if (updateData.isCurrent === true) {
    return await switchCurrentAcademicYear(academicYearId, updateData);
  }

  return await updateAcademicYear(academicYearId, updateData);
};

export const deactivateAcademicYearService = async (academicYearId) => {
  const academicYear = await findAcademicYearById(academicYearId);

  if (!academicYear) {
    throw new AppError("Academic year not found", 404);
  }

  if (academicYear.status === "INACTIVE") {
    throw new AppError("Academic year is already inactive", 400);
  }

  if (academicYear.isCurrent) {
    throw new AppError("Cannot deactivate the current academic year", 400);
  }

  const updatedAcademicYear = await updateAcademicYear(academicYearId, {
    status: "INACTIVE",
  });

  return updatedAcademicYear;
};

export const activateAcademicYearService = async (academicYearId) => {
  const academicYear = await findAcademicYearById(academicYearId);

  if (!academicYear) {
    throw new AppError("Academic year not found", 404);
  }

  if (academicYear.status === "ACTIVE" && academicYear.isCurrent) {
    throw new AppError("Academic year is already active and current", 400);
  }

  const updatedAcademicYear = await switchCurrentAcademicYear(academicYearId, {
    status: "ACTIVE",
  });

  return updatedAcademicYear;
};
