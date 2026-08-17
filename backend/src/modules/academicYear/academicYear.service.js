import mongoose from "mongoose";
import AppError from "../../shared/utils/error/AppError.js";
import {
  clearCurrentAcademicYear,
  countAcademicYears,
  createAcademicYear,
  findAcademicYearById,
  findAcademicYearByName,
  findAcademicYears,
  findCurrentAcademicYear,
  updateAcademicYear,
} from "./academicYear.repository.js";

const switchCurrentAcademicYear = async (academicYearId, updateData = {}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    await clearCurrentAcademicYear(session);

    const updatedAcademicYear = await updateAcademicYear(
      academicYearId,
      { ...updateData, isCurrent: true, status: "ACTIVE" },
      session,
    );

    await session.commitTransaction();

    return updatedAcademicYear;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

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

  if (isCurrent === true) {
    const session = await mongoose.startSession();

    try {
      session.startTransaction();

      const currentAcademicYear = await findCurrentAcademicYear(session);

      if (currentAcademicYear) {
        throw new AppError(
          "Another academic year is already marked as current",
          400,
        );
      }

      const createdAcademicYear = await createAcademicYear(
        academicYearData,
        session,
      );

      await session.commitTransaction();

      return createdAcademicYear;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
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
