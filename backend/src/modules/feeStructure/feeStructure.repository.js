import FeeStructure from "./feeStructure.model.js";

export const createFeeStructure = async (feeStructureData) => {
  return await FeeStructure.create(feeStructureData);
};

export const findFeeStructureById = async (feeStructureId) => {
  return await FeeStructure.findById(feeStructureId);
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

export const updateFeeStructure = async (feeStructureId, updateData) => {
  return await FeeStructure.findByIdAndUpdate(feeStructureId, updateData, {
    new: true,
    runValidators: true,
  });
};
