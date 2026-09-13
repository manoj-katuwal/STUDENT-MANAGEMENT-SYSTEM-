import FeeStructure from "./feeStructure.model.js";

export const createFeeStructure = async (feeStructureData) => {
  return await FeeStructure.create(feeStructureData);
};

export const findFeeStructureById = async (feeStructureId) => {
  return await FeeStructure.findById(feeStructureId)
    .populate("academicYearId", "name")
    .populate("classId", "name");
};

export const findFeeStructureByCombination = async ({
  academicYearId,
  classId,
  feeType,
}) => {
  return await FeeStructure.findOne({
    academicYearId,
    classId,
    feeType,
  });
};

export const findFeeStructures = async ({
  filter = {},
  skip = 0,
  limit = 10,
}) => {
  return await FeeStructure.find(filter)
    .populate("academicYearId", "name")
    .populate("classId", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const countFeeStructures = async (filter = {}) => {
  return await FeeStructure.countDocuments(filter);
};

export const getFeeStructureStats = async () => {
  const [total, active, tuition, transport, exam, tuitionAmounts] = await Promise.all([
    FeeStructure.countDocuments(),
    FeeStructure.countDocuments({ status: "ACTIVE" }),
    FeeStructure.countDocuments({ feeType: "TUITION" }),
    FeeStructure.countDocuments({ feeType: "TRANSPORT" }),
    FeeStructure.countDocuments({ feeType: "EXAM" }),
    FeeStructure.aggregate([
      { $match: { feeType: "TUITION" } },
      { $group: { _id: null, average: { $avg: "$amount" } } },
    ]),
  ]);

  return {
    total,
    active,
    inactive: total - active,
    activePercentage: total ? (active / total) * 100 : 0,
    tuition,
    auxiliary: transport + exam,
    transport,
    exam,
    averageTuitionAmount: tuitionAmounts[0]?.average ?? 0,
  };
};

export const updateFeeStructure = async (feeStructureId, updateData) => {
  return await FeeStructure.findByIdAndUpdate(feeStructureId, updateData, {
    new: true,
    runValidators: true,
  });
};
