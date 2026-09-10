import Section from "./section.model.js";

export const createSection = async (sectionData) => {
  return await Section.create(sectionData);
};

export const findSectionById = async (sectionId) => {
  return await Section.findById(sectionId).populate("classId", "name code");
};

export const findSectionByNameAndClass = async (name, classId) => {
  return await Section.findOne({
    name,
    classId,
  }).populate("classId", "name code");
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

export const findSectionsForExport = async (filter = {}) => {
  return await Section.find(filter)
    .populate("classId", "name code")
    .sort({ createdAt: -1 });
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

export const getSectionStats = async () => {
  const thirtyDaysAgo = new Date();

  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [totalSections, activeSections, inactiveSections, recentlyAdded] =
    await Promise.all([
      Section.countDocuments(),
      Section.countDocuments({ status: "ACTIVE" }),
      Section.countDocuments({ status: "INACTIVE" }),
      Section.countDocuments({
        createdAt: {
          $gte: thirtyDaysAgo,
        },
      }),
    ]);

  return {
    totalSections,
    activeSections,
    inactiveSections,
    recentlyAdded,
  };
};
