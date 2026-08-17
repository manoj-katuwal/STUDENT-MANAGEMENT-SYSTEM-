import AppError from "../../shared/utils/error/AppError.js";
import {
  createAcademicYear,
  findAcademicYearById,
  findAcademicYearByName,
  findCurrentAcademicYear,
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