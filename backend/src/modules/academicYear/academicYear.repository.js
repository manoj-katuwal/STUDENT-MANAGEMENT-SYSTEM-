import AcademicYear from "./academicYear.model.js";

export const createAcademicYear = async (academicYearData, session = null) => {
  const academicYear = new AcademicYear(academicYearData);

  if (session) {
    await academicYear.save({ session });
    return academicYear;
  }

  return await academicYear.save();
};

export const findAcademicYearById = async (academicYearId, session = null) => {
  return await AcademicYear.findById(
    academicYearId,
    null,
    session ? { session } : {},
  );
};

export const findAcademicYearByName = async (name) => {
  return await AcademicYear.findOne({ name });
};

export const findCurrentAcademicYear = async (session = null) => {
  return await AcademicYear.findOne(
    {
      isCurrent: true,
    },
    null,
    session ? { session } : {},
  );
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

export const updateAcademicYear = async (
  academicYearId,
  updateData,
  session = null,
) => {
  return await AcademicYear.findByIdAndUpdate(academicYearId, updateData, {
    new: true,
    runValidators: true,
    ...(session && { session }),
  });
};

export const clearCurrentAcademicYear = async (session) => {
  return await AcademicYear.updateMany(
    { isCurrent: true },
    { $set: { isCurrent: false } },
    { session },
  );
};
