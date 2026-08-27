import Receipt from "./receipt.model.js";

export const createReceipt = async (receiptData, options = {}) => {
  return await Receipt.create([receiptData], options).then(
    (result) => result[0],
  );
};

export const findReceiptByPaymentId = async (paymentId, options = {}) => {
  return await Receipt.findOne({ paymentId }, null, options);
};

export const findReceiptByReceiptNumber = async (
  receiptNumber,
  options = {},
) => {
  return await Receipt.findOne({ receiptNumber }, null, options);
};

export const findReceiptById = async (receiptId) => {
  return await Receipt.findById(receiptId);
};

export const findReceipts = async (filter = {}, skip = 0, limit = 10) => {
  return await Receipt.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const countReceipts = async (filter = {}) => {
  return await Receipt.countDocuments(filter);
};