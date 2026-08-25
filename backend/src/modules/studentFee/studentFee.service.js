import { countStudentFees, createStudentFee, findStudentFee, findStudentFeeById, findStudentFees, getStudentFeeSummary, updateStudentFee } from "./studentFee.repository.js";
import { findStudentById } from "../students/student.repository.js";
import { findAcademicYearById } from "../academicYear/academicYear.repository.js";
import { findFeeStructureById } from "../feeStructure/feeStructure.repository.js";
import AppError from "../../shared/utils/error/AppError.js";
import { logActivity } from "../auditLog/auditLog.service.js";

export const createStudentFeeService = async (studentFeeData, performedBy) => {
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

  await logActivity({
    entityType: "StudentFee",
    entityId: studentFee._id,
    action: "CREATED",
    description: "Student fee assigned",
    performedBy,
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

export const getStudentFeesService = async ({
  page = 1,
  limit = 10,
  studentId,
  academicYearId,
  feeStructureId,
  status,
}) => {
  const filter = {};

  if (studentId) {
    filter.studentId = studentId;
  }

  if (academicYearId) {
    filter.academicYearId = academicYearId;
  }

  if (feeStructureId) {
    filter.feeStructureId = feeStructureId;
  }

  if (status) {
    filter.status = status;
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);

  const skip = (pageNumber - 1) * limitNumber;

  const [studentFees, total] = await Promise.all([
    findStudentFees({
      filter,
      skip,
      limit: limitNumber,
    }),

    countStudentFees(filter),
  ]);

  const totalPages = Math.ceil(total / limitNumber);

  return {
    studentFees,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages,
      hasNextPage: pageNumber < totalPages,
      hasPreviousPage: pageNumber > 1,
    },
  };
};

export const updateStudentFeeService = async (studentFeeId, updateData, performedBy) => {
  const studentFee = await findStudentFeeById(studentFeeId);

  if (!studentFee) {
    throw new AppError("Student fee not found", 404);
  }

  // Only discount can be modified here
  const { discountAmount } = updateData;

  if (discountAmount === undefined) {
    throw new AppError("Only discount amount can be updated", 400);
  }

  if (discountAmount < 0) {
    throw new AppError("Discount amount cannot be negative", 400);
  }

  if (discountAmount > studentFee.totalAmount) {
    throw new AppError(
      "Discount cannot be greater than the total fee amount",
      400,
    );
  }

  // Recalculate financial values
  const netAmount = studentFee.totalAmount - discountAmount;

  const paidAmount = studentFee.paidAmount;

  const dueAmount = netAmount - paidAmount;

  // Prevent discount from making due negative
  if (dueAmount < 0) {
    throw new AppError(
      "Discount cannot reduce the fee below the amount already paid",
      400,
    );
  }

  let status = "PENDING";

  if (dueAmount === 0) {
    status = "PAID";
  } else if (paidAmount > 0) {
    status = "PARTIAL";
  }

  const updatedStudentFee = await updateStudentFee(studentFeeId, {
    discountAmount,
    netAmount,
    dueAmount,
    status,
  });

  await logActivity({
    entityType: "StudentFee",
    entityId: updatedStudentFee._id,
    action: "UPDATED",
    description: "Student fee discount amount updated",
    performedBy,
  });

  return updatedStudentFee;
};

export const cancelStudentFeeService = async (studentFeeId, performedBy) => {
  const studentFee = await findStudentFeeById(studentFeeId);

  if (!studentFee) {
    throw new AppError("Student fee not found", 404);
  }

  // Already cancelled
  if (studentFee.status === "CANCELLED") {
    throw new AppError("Student fee is already cancelled", 400);
  }

  // Cannot cancel if payment already exists
  if (studentFee.paidAmount > 0) {
    throw new AppError(
      "Cannot cancel a student fee with existing payment",
      400,
    );
  }

  const cancelledStudentFee = await updateStudentFee(studentFeeId, {
    status: "CANCELLED",
  });

  await logActivity({
    entityType: "StudentFee",
    entityId: cancelledStudentFee._id,
    action: "CANCELLED",
    description: "Student fee cancelled",
    performedBy,
  });

  return cancelledStudentFee;
};

export const getStudentFeeSummaryService = async (studentId) => {
  if (!studentId) {
    throw new AppError("Student ID is required", 400);
  }

  const student = await findStudentById(studentId);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  const summary = await getStudentFeeSummary(studentId);

  return summary;
};
