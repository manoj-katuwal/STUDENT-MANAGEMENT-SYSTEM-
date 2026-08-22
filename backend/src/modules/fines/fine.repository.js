import Fine from "./fine.model.js";
import mongoose from "mongoose";

export const findActiveFineByStudentFeeAndPolicy = async (
  studentFeeId,
  finePolicyId,
) => {
  return await Fine.findOne({
    studentFeeId,
    finePolicyId,
    status: "ACTIVE",
  });
};

export const createFine = async (data) => {
  return await Fine.create(data);
};

export const updateFine = async (id, data) => {
  return await Fine.findByIdAndUpdate(id, data, { new: true });
};



export const getTotalActiveFineByStudentFeeId = async (studentFeeId) => {
  const result = await Fine.aggregate([
    {
      $match: {
        studentFeeId: new mongoose.Types.ObjectId(studentFeeId),
        status: "ACTIVE",
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  return result[0]?.total || 0;
};