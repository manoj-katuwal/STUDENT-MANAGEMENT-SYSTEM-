import StudentFee from "./studentFee.model.js";

export const createStudentFee = async (studentFeeData) => {
  return await StudentFee.create(studentFeeData);
};

export const findStudentFeeById = async (studentFeeId) => {
  return await StudentFee.findById(studentFeeId);
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
    .populate("feeStructureId")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const countStudentFees = async (filter = {}) => {
  return await StudentFee.countDocuments(filter);
};

export const updateStudentFee = async (studentFeeId, updateData) => {
  return await StudentFee.findByIdAndUpdate(studentFeeId, updateData, {
    new: true,
    runValidators: true,
  });
};
