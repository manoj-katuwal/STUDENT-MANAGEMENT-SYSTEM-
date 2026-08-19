import { getNextReceiptSequence } from "./receiptCounter.repository.js";

export const generateReceiptNumber = async (options = {}) => {
  const year = new Date().getFullYear();

  const sequence = await getNextReceiptSequence(year, options);

  const paddedSequence = String(sequence).padStart(6, "0");

  return `REC-${year}-${paddedSequence}`;
};
