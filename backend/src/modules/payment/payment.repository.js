import Payment from "./payment.model.js";
import mongoose from "mongoose";

export const create = async (data) => {
  return await Payment.create(data);
};

export const findById = async (id) => {
  return await Payment.findById(id);
};

export const findByTransactionId = async (transactionId) => {
  return await Payment.findOne({ transactionId });
};

export const findByStudentFeeId = async (studentFeeId) => {
  return await Payment.find({ studentFeeId }).sort({
    createdAt: -1,
  });
};

export const getTotalPaidAmount = async (studentFeeId) => {
  const result = await Payment.aggregate([
    {
      $match: {
        studentFeeId: new mongoose.Types.ObjectId(studentFeeId),
        paymentStatus: "SUCCESS",
      },
    },
    {
      $group: {
        _id: "$studentFeeId",
        totalPaid: { $sum: "$amount" },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalPaid : 0;
};

export const updateStatus = async (id, status) => {
  return await Payment.findByIdAndUpdate(
    id,
    { paymentStatus: status },
    { new: true },
  );
};
