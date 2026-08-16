import AppError from "../../shared/utils/error/AppError.js";
import {
  createClass,
  findClassByName,
  findClassByCode,
  findClasses,
  findClassById,
  updateClass,
  updateClassStatus,
  countClasses,
} from "./class.repository.js";

export const createClassService = async (classData) => {
  const existingClassByName = await findClassByName(classData.name);

  if (existingClassByName) {
    throw new AppError("Class with this name already exists", 400);
  }

  const existingClassByCode = await findClassByCode(classData.code);

  if (existingClassByCode) {
    throw new AppError("Class with this code already exists", 400);
  }

  const classRecord = await createClass(classData);

  return classRecord;
};

export const getClassesService = async (page = 1, limit = 10, search = "") => {
  const skip = (page - 1) * limit;

  const filter = {};

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        code: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const [classes, total] = await Promise.all([
    findClasses(filter, skip, limit),
    countClasses(filter),
  ]);

  return {
    classes,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getClassByIdService = async (classId) => {
  const classRecord = await findClassById(classId);

  if (!classRecord) {
    throw new AppError("Class not found", 404);
  }

  return classRecord;
};

export const updateClassService = async (classId, updateData) => {
  const classRecord = await findClassById(classId);

  if (!classRecord) {
    throw new AppError("Class not found", 404);
  }

  if (updateData.name && updateData.name !== classRecord.name) {
    const existingClass = await findClassByName(updateData.name);

    if (existingClass) {
      throw new AppError("Class with this name already exists", 400);
    }
  }

  if (updateData.code && updateData.code !== classRecord.code) {
    const existingClass = await findClassByCode(updateData.code);

    if (existingClass) {
      throw new AppError("Class with this code already exists", 400);
    }
  }

  const updatedClass = await updateClass(classId, updateData);

  return updatedClass;
};

export const updateClassStatusService = async (classId, status) => {
  const classRecord = await findClassById(classId);

  if (!classRecord) {
    throw new AppError("Class not found", 404);
  }

  if (classRecord.status === status) {
    throw new AppError(`Class is already ${status.toLowerCase()}`, 400);
  }

  return await updateClassStatus(classId, status);
};
