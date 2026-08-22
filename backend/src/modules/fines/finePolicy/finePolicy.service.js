import AppError from "../../../shared/utils/error/AppError.js";
import { findAcademicYearById } from "../../academicYear/academicYear.repository.js";
import { createFinePolicy } from "./finePolicy.repository.js";


export const createFinePolicyService = async ({
  name,
  type,
  amount,
  gracePeriodDays,
  maxFineAmount,
  applicableFeeTypes,
  academicYearId,
  createdBy,
}) => {
  const academicYear = await findAcademicYearById(academicYearId);

  if (!academicYear) {
    throw new AppError("Academic year not found", 404);
  }

  if (!["FIXED", "DAILY_FIXED", "PERCENTAGE"].includes(type)) {
    throw new AppError("Invalid fine policy type", 400);
  }

  if (type === "PERCENTAGE") {
    throw new AppError(
      "Percentage-based fine policies are not supported yet",
      400,
    );
  }

  if (!amount || amount <= 0) {
    throw new AppError("Fine amount must be greater than 0", 400);
  }

  if (!maxFineAmount || maxFineAmount <= 0) {
    throw new AppError("Max fine amount must be greater than 0", 400);
  }

  if (!applicableFeeTypes || applicableFeeTypes.length === 0) {
    throw new AppError("At least one applicable fee type is required", 400);
  }

  const policy = await createFinePolicy({
    name,
    type,
    amount,
    gracePeriodDays: gracePeriodDays || 0,
    maxFineAmount,
    applicableFeeTypes,
    academicYearId,
    status: "ACTIVE",
    createdBy,
  });

  return policy;
};
