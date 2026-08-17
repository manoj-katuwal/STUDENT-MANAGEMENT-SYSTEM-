import AppError from "../../shared/utils/error/AppError.js";
import { findAcademicYearById } from "../academicYear/academicYear.repository.js";
import { findClassById } from "../classes/class.repository.js";
import { countFeeStructures, createFeeStructure, findFeeStructureByCombination, findFeeStructures } from "./feeStructure.repository.js";

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
