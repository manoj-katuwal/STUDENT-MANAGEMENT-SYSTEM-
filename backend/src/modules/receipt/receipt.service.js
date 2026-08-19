import AppError from "../../shared/utils/error/AppError.js";
import {
  createReceipt,
  findReceiptById,
  findReceiptByPaymentId,
  findReceiptByReceiptNumber,
} from "./receipt.repository.js";
import { findStudentFeeById } from "../studentFee/studentFee.repository.js";
import { findStudentByUserId } from "../students/student.repository.js";

const ensureReceiptAccess = async (receipt, user) => {
  if (user.role !== "STUDENT") {
    return receipt;
  }

  const student = await findStudentByUserId(user.id);

  if (!student) {
    throw new AppError("Student profile not found", 403);
  }

  const studentFee = await findStudentFeeById(receipt.studentFeeId);

  if (!studentFee || String(studentFee.studentId) !== String(student._id)) {
    throw new AppError("You are not authorized to access this receipt", 403);
  }

  return receipt;
};

export const createReceiptService = async (
  {
    paymentId,
    studentFeeId,
    amount,
    paymentMethod,
    paymentType,
    paidAt,
    receiptNumber,
  },
  options = {},
) => {
  if (!paymentId) {
    throw new AppError("Payment ID is required", 400);
  }

  if (!studentFeeId) {
    throw new AppError("Student fee ID is required", 400);
  }

  if (!amount || amount <= 0) {
    throw new AppError("Valid receipt amount is required", 400);
  }

  if (!paymentMethod) {
    throw new AppError("Payment method is required", 400);
  }

  if (!paymentType) {
    throw new AppError("Payment type is required", 400);
  }

  if (!paidAt) {
    throw new AppError("Payment date is required", 400);
  }

  // Prevent duplicate receipt for the same payment
  const existingReceipt = await findReceiptByPaymentId(paymentId, options);

  if (existingReceipt) {
    return existingReceipt;
  }

  if (!receiptNumber) {
    throw new AppError("Receipt number is required", 400);
  }

  return await createReceipt(
    {
      paymentId,
      studentFeeId,
      receiptNumber,
      amount,
      paymentMethod,
      paymentType,
      paidAt,
    },
    options,
  );
};

export const getReceiptByIdService = async (receiptId, user) => {
  const receipt = await findReceiptById(receiptId);

  if (!receipt) {
    throw new AppError("Receipt not found", 404);
  }

  return await ensureReceiptAccess(receipt, user);
};

export const getReceiptByPaymentIdService = async (paymentId, user) => {
  const receipt = await findReceiptByPaymentId(paymentId);

  if (!receipt) {
    throw new AppError("Receipt not found for this payment", 404);
  }

  return await ensureReceiptAccess(receipt, user);
};

export const getReceiptByReceiptNumberService = async (receiptNumber, user) => {
  const receipt = await findReceiptByReceiptNumber(receiptNumber);

  if (!receipt) {
    throw new AppError("Receipt not found", 404);
  }

  return await ensureReceiptAccess(receipt, user);
};

