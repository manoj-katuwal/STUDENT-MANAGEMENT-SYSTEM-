import AppError from "../../shared/utils/error/AppError.js";
import { findReceiptById } from "./receipt.repository.js";

export const getReceiptByIdService = async (receiptId) => {
  const receipt = await findReceiptById(receiptId);

  if (!receipt) {
    throw new AppError("Receipt not found", 404);
  }

  return receipt;
};

