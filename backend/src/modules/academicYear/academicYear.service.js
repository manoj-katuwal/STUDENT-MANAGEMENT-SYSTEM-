import AppError from "../../shared/utils/error/AppError.js";
import {
  countAcademicYears,
  createAcademicYear,
  findAcademicYearById,
  findAcademicYearByName,
  findAcademicYears,
  findCurrentAcademicYear,
  updateAcademicYear,
} from "./academicYear.repository.js";

export const createAcademicYearService = async (academicYearData) => {
  const { name, startDate, endDate, isCurrent } = academicYearData;

  if (!name) {
    throw new AppError("Academic year name is required", 400);
  }

  if (!startDate || !endDate) {
    throw new AppError("Start date and end date are required", 400);
  }

  if (new Date(startDate) >= new Date(endDate)) {
    throw new AppError("Start date must be before end date", 400);
  }

  const existingAcademicYear = await findAcademicYearByName(name);

  if (existingAcademicYear) {
    throw new AppError("Academic year with this name already exists", 400);
  }

  if (isCurrent) {
    const currentAcademicYear = await findCurrentAcademicYear();

    if (currentAcademicYear) {
      throw new AppError(
        "Another academic year is already marked as current",
        400,
      );
    }
  }

  return await createAcademicYear(academicYearData);
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
    const currentAcademicYear = await findCurrentAcademicYear();

    if (
      currentAcademicYear &&
      currentAcademicYear._id.toString() !== academicYearId.toString()
    ) {
      throw new AppError(
        "Another academic year is already marked as current",
        400,
      );
    }
  }

  return await updateAcademicYear(academicYearId, updateData);
};