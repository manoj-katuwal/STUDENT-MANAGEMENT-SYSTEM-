import AppError from "../../shared/utils/error/AppError.js";
import { createReceipt, findReceiptByPaymentId } from "./receipt.repository.js";

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
