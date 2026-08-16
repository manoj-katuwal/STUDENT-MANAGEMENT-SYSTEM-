import AppError from "../../shared/utils/error/AppError.js";
import {
  createClass,
  findClassByName,
  findClassByCode,
  findClasses,
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

export const getClassesService = async () => {
  const classes = await findClasses();

  return classes;
};
