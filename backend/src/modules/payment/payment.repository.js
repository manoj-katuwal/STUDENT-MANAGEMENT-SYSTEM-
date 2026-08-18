import Payment from "./payment.model.js";

export const createPayment = async (paymentData) => {
  return await Payment.create(paymentData);
};

export const findPaymentById = async (paymentId) => {
  return await Payment.findById(paymentId);
};

export const findPaymentByTransactionId = async (transactionId) => {
  return await Payment.findOne({ transactionId });
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
