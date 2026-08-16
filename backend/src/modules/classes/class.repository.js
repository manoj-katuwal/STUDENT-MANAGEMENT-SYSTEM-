import Class from "./class.model.js";

export const createClass = async (classData) => {
  return await Class.create(classData);
};

export const findClassById = async (classId) => {
  return await Class.findById(classId);
};

export const findClassByName = async (name) => {
  return await Class.findOne({ name });
};

export const findClassByCode = async (code) => {
  return await Class.findOne({ code });
};



export const findClasses = async (filter = {}, skip = 0, limit = 10) => {
  return await Class.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const countClasses = async (filter = {}) => {
  return await Class.countDocuments(filter);
};

export const updateClass = async (classId, updateData) => {
  return await Class.findByIdAndUpdate(classId, updateData, {
    new: true,
    runValidators: true,
  });
};

export const updateClassStatus = async (classId, status) => {
  return await Class.findByIdAndUpdate(
    classId,
    { status },
    {
      new: true,
      runValidators: true,
    },
  );
};