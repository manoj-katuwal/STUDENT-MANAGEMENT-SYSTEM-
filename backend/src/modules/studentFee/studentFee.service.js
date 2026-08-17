import { createStudentFee, findStudentFee, findStudentFeeById } from "./studentFee.repository.js";
import { findStudentById } from "../students/student.repository.js";
import { findAcademicYearById } from "../academicYear/academicYear.repository.js";
import { findFeeStructureById } from "../feeStructure/feeStructure.repository.js";
import AppError from "../../shared/utils/error/AppError.js";

export const createStudentFeeService = async (studentFeeData) => {
  const {
    studentId,
    academicYearId,
    feeStructureId,
    discountAmount = 0,
  } = studentFeeData;

  // 1. Required relationships
  if (!studentId) {
    throw new AppError("Student is required", 400);
  }

  if (!academicYearId) {
    throw new AppError("Academic year is required", 400);
  }

  if (!feeStructureId) {
    throw new AppError("Fee structure is required", 400);
  }

  // 2. Find Student
  const student = await findStudentById(studentId);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  // 3. Find Academic Year
  const academicYear = await findAcademicYearById(academicYearId);

  if (!academicYear) {
    throw new AppError("Academic year not found", 404);
  }

  if (academicYear.status === "INACTIVE") {
    throw new AppError("Cannot assign fee to an inactive academic year", 400);
  }

  // 4. Find Fee Structure
  const feeStructure = await findFeeStructureById(feeStructureId);

  if (!feeStructure) {
    throw new AppError("Fee structure not found", 404);
  }

  // 5. Prevent duplicate assignment
  const existingStudentFee = await findStudentFee({
    studentId,
    academicYearId,
    feeStructureId,
  });

  if (existingStudentFee) {
    throw new AppError(
      "This fee structure is already assigned to the student for this academic year",
      400,
    );
  }

  // 6. Validate discount
  if (discountAmount < 0) {
    throw new AppError("Discount amount cannot be negative", 400);
  }

  const totalAmount = feeStructure.amount;

  if (discountAmount > totalAmount) {
    throw new AppError(
      "Discount cannot be greater than the total fee amount",
      400,
    );
  }

  // 7. Calculate fee values
  const netAmount = totalAmount - discountAmount;

  const paidAmount = 0;

  const dueAmount = netAmount;

  const status = netAmount === 0 ? "PAID" : "PENDING";

  // 8. Create Student Fee
  const studentFee = await createStudentFee({
    studentId,
    academicYearId,
    feeStructureId,
    totalAmount,
    discountAmount,
    netAmount,
    paidAmount,
    dueAmount,
    status,
  });

  return studentFee;
};

export const getStudentFeeByIdService = async (studentFeeId) => {
  const studentFee = await findStudentFeeById(studentFeeId);

  if (!studentFee) {
    throw new AppError("Student fee not found", 404);
  }

  return studentFee;
};