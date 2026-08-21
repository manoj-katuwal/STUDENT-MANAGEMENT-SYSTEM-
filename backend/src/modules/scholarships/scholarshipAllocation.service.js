import AppError from "../../shared/utils/error/AppError.js";
import {
  findStudentFeeById,
  updateStudentFee,
} from "../studentFee/studentFee.repository.js";
import { findScholarshipById } from "./scholarship.repository.js";
import {
  createAllocation,
  getTotalAllocatedByScholarshipId,
  getTotalAllocatedByStudentFeeId,
} from "./scholarshipAllocation.repository.js";

export const allocateScholarshipService = async ({
  scholarshipId,
  studentFeeId,
  amount,
  allocatedBy,
}) => {
  const scholarship = await findScholarshipById(scholarshipId);

  if (!scholarship) {
    throw new AppError("Scholarship not found", 404);
  }

  if (scholarship.status !== "ACTIVE") {
    throw new AppError("Scholarship is not active", 400);
  }

  const studentFee = await findStudentFeeById(studentFeeId);

  if (!studentFee) {
    throw new AppError("Student fee not found", 404);
  }

  if (String(scholarship.studentId) !== String(studentFee.studentId)) {
    throw new AppError("Scholarship does not belong to this student", 400);
  }
  const applicableAmount = studentFee.totalAmount - studentFee.discountAmount;

  let allocatedAmount;

  if (scholarship.valueType === "PERCENTAGE") {
    allocatedAmount = (applicableAmount * scholarship.value) / 100;
  }

  if (scholarship.valueType === "FIXED") {
    if (!amount || amount <= 0) {
      throw new AppError(
        "Allocation amount must be greater than 0 for fixed scholarships",
        400,
      );
    }
    allocatedAmount = amount;
  }
  // Scholarship-level cap: FIXED scholarships have a total value to respect.
  // (PERCENTAGE scholarships are computed per-fee, so this cap mainly guards FIXED type.)
  if (scholarship.valueType === "FIXED") {
    const alreadyAllocated =
      await getTotalAllocatedByScholarshipId(scholarshipId);

    if (alreadyAllocated + allocatedAmount > scholarship.value) {
      throw new AppError(
        "Allocation exceeds the scholarship's remaining balance",
        400,
      );
    }
  }

  // StudentFee-level cap: combined discount + scholarship must not push
  // netAmount below what's already been paid.
  const existingScholarshipTotal =
    await getTotalAllocatedByStudentFeeId(studentFeeId);

  const newScholarshipTotal = existingScholarshipTotal + allocatedAmount;

  if (newScholarshipTotal > applicableAmount) {
    throw new AppError(
      "Total scholarship allocation cannot exceed the fee remaining after discount",
      400,
    );
  }

  const newNetAmount =
    studentFee.totalAmount - studentFee.discountAmount - newScholarshipTotal;

  if (newNetAmount < studentFee.paidAmount) {
    throw new AppError(
      "Allocation would reduce net amount below the amount already paid",
      400,
    );
  }

  const allocation = await createAllocation({
    scholarshipId,
    studentFeeId,
    allocatedAmount,
    status: "ACTIVE",
    allocatedBy,
  });

  const updatedStudentFee = await updateStudentFee(studentFeeId, {
    scholarshipAmount: newScholarshipTotal,
    netAmount: newNetAmount,
    dueAmount: newNetAmount - studentFee.paidAmount,
    status:
      newNetAmount - studentFee.paidAmount === 0 ? "PAID" : studentFee.status,
  });

  return {
    allocation,
    studentFee: updatedStudentFee,
  };
};
