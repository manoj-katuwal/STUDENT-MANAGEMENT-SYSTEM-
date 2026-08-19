import Receipt from "./receipt.model.js";

export const createReceipt = async (receiptData, options = {}) => {
  return await Receipt.create([receiptData], options).then(
    (result) => result[0],
  );
};

export const findReceiptByPaymentId = async (paymentId, options = {}) => {
  return await Receipt.findOne({ paymentId }, null, options);
};

export const findReceiptByReceiptNumber = async (receiptNumber) => {
  return await Receipt.findOne({ receiptNumber });
};

export const findReceiptById = async (receiptId) => {
  return await Receipt.findById(receiptId);
};