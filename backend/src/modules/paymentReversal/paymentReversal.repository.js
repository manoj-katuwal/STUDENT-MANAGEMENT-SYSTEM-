import PaymentReversal from "./paymentReversal.model.js";

export const createPaymentReversal = async (data, options = {}) => {
  return await PaymentReversal.create([data], options).then(
    (result) => result[0],
  );
};

export const findReversalByPaymentId = async (paymentId) => {
  return await PaymentReversal.findOne({ paymentId });
};

export const findReversalById = async (id) => {
  return await PaymentReversal.findById(id)
    .populate("paymentId")
    .populate("studentFeeId")
    .populate("reversedBy", "name email");
};
