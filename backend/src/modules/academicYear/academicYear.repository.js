import AcademicYear from "./academicYear.model.js";

export const createAcademicYear = async (academicYearData) => {
  return await AcademicYear.create(academicYearData);
};

export const findAcademicYearById = async (academicYearId) => {
  return await AcademicYear.findById(academicYearId);
};

export const findAcademicYearByName = async (name) => {
  return await AcademicYear.findOne({ name });
};

export const findCurrentAcademicYear = async () => {
  return await AcademicYear.findOne({
    isCurrent: true,
  });
};

export const findAcademicYears = async ({
  filter = {},
  skip = 0,
  limit = 10,
}) => {
  return await AcademicYear.find(filter)
    .sort({ startDate: -1 })
    .skip(skip)
    .limit(limit);
};

export const countAcademicYears = async (filter = {}) => {
  return await AcademicYear.countDocuments(filter);
};

export const updateAcademicYear = async (academicYearId, updateData) => {
  return await AcademicYear.findByIdAndUpdate(academicYearId, updateData, {
    new: true,
    runValidators: true,
  });
};

export const clearCurrentAcademicYear = async () => {
  return await AcademicYear.updateMany(
    { isCurrent: true },
    { $set: { isCurrent: false } },
  );
};
