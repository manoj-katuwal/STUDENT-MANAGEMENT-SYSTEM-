import StudentFee from "./studentFee.model.js";
import mongoose from "mongoose";

export const createStudentFee = async (studentFeeData) => {
  return await StudentFee.create(studentFeeData);
};

export const findStudentFeeById = async (studentFeeId, options = {}) => {
  return await StudentFee.findById(studentFeeId, null, options);
};

export const findStudentFee = async (filter = {}) => {
  return await StudentFee.findOne(filter);
};

export const findStudentFees = async ({
  filter = {},
  skip = 0,
  limit = 10,
}) => {
  return await StudentFee.find(filter)
    .populate("studentId", "name admissionNumber")
    .populate("academicYearId", "name")
    .populate("feeStructureId", "feeType amount")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const countStudentFees = async (filter = {}) => {
  return await StudentFee.countDocuments(filter);
};

export const updateStudentFee = async (
  studentFeeId,
  updateData,
  options = {},
) => {
  return await StudentFee.findByIdAndUpdate(studentFeeId, updateData, {
    new: true,
    runValidators: true,
    ...options,
  });
};
export const getStudentFeeSummary = async (studentId) => {
  const result = await StudentFee.aggregate([
    {
      $match: {
        studentId: new mongoose.Types.ObjectId(studentId),
        status: {
          $ne: "CANCELLED",
        },
      },
    },
    {
      $group: {
        _id: null,

        totalAmount: {
          $sum: "$totalAmount",
        },

        discountAmount: {
          $sum: "$discountAmount",
        },

        netAmount: {
          $sum: "$netAmount",
        },

        paidAmount: {
          $sum: "$paidAmount",
        },

        dueAmount: {
          $sum: "$dueAmount",
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalAmount: 1,
        discountAmount: 1,
        netAmount: 1,
        paidAmount: 1,
        dueAmount: 1,
      },
    },
  ]);

  return (
    result[0] || {
      totalAmount: 0,
      discountAmount: 0,
      netAmount: 0,
      paidAmount: 0,
      dueAmount: 0,
    }
  );
};

export const updatePaymentStatus = async (id, { paidAmount, dueAmount, status } = {}) => {
  return await StudentFee.findByIdAndUpdate(
    id,
    { paidAmount, dueAmount, status },
    { new: true },
  );
};