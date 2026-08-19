import Payment from "./payment.model.js";

export const createPayment = async (paymentData, options = {}) => {
  return await Payment.create([paymentData], options).then(
    (result) => result[0],
  );
};

export const findPaymentById = async (paymentId, options = {}) => {
  return await Payment.findById(paymentId, null, options);
};

export const findPaymentByTransactionId = async (
  transactionId,
  options = {},
) => {
  return await Payment.findOne({ transactionId }, null, options);
};

export const findPaymentsByStudentFeeId = async (studentFeeId) => {
  return await Payment.find({ studentFeeId }).sort({ createdAt: -1 });
};

export const findPayments = async ({ filter = {}, skip = 0, limit = 10 }) => {
  return await Payment.find(filter)
    .populate({
      path: "studentFeeId",
      populate: [
        {
          path: "studentId",
          select: "name admissionNumber",
        },
        {
          path: "academicYearId",
          select: "name",
        },
        {
          path: "feeStructureId",
          select: "feeType amount",
        },
      ],
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const countPayments = async (filter = {}) => {
  return await Payment.countDocuments(filter);
};
