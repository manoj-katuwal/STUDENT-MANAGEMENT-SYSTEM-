import mongoose from "mongoose";
import ScholarshipAllocation from "./scholarshipAllocation.model.js";

export const createAllocation = async (data) => {
  return await ScholarshipAllocation.create(data);
};

export const findAllocationById = async (id) => {
  return await ScholarshipAllocation.findById(id);
};

export const getTotalAllocatedByScholarshipId = async (scholarshipId) => {
  const result = await ScholarshipAllocation.aggregate([
    {
      $match: {
        scholarshipId: new mongoose.Types.ObjectId(scholarshipId),
        status: "ACTIVE",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$allocatedAmount" },
      },
    },
  ]);

  return result[0]?.total || 0;
};

export const getTotalAllocatedByStudentFeeId = async (studentFeeId) => {
  const result = await ScholarshipAllocation.aggregate([
    {
      $match: {
        studentFeeId: new mongoose.Types.ObjectId(studentFeeId),
        status: "ACTIVE",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$allocatedAmount" },
      },
    },
  ]);

  return result[0]?.total || 0;
};
