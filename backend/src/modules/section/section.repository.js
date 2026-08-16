import Section from "./section.model.js";

export const createSection = async (sectionData) => {
  return await Section.create(sectionData);
};

export const findSectionById = async (sectionId) => {
  return await Section.findById(sectionId);
};

export const findSectionByNameAndClass = async (name, classId) => {
  return await Section.findOne({
    name,
    classId,
  });
};

export const findSections = async (filter = {}, skip = 0, limit = 10) => {
  return await Section.find(filter)
    .populate("classId", "name code")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const countSections = async (filter = {}) => {
  return await Section.countDocuments(filter);
};

export const updateSection = async (sectionId, updateData) => {
  return await Section.findByIdAndUpdate(sectionId, updateData, {
    new: true,
    runValidators: true,
  });
};

export const updateSectionStatus = async (sectionId, status) => {
  return await Section.findByIdAndUpdate(
    sectionId,
    { status },
    {
      new: true,
      runValidators: true,
    },
  );
};
