import {
  createSection,
  findSectionByNameAndClass,
} from "./section.repository.js";

import { findClassById } from "../classes/class.repository.js";
import AppError from "../../shared/utils/error/AppError.js";

export const createSectionService = async (sectionData) => {
  const { name, classId } = sectionData;

  const classRecord = await findClassById(classId);

  if (!classRecord) {
    throw new AppError("Class not found", 404);
  }

  if (classRecord.status === "INACTIVE") {
    throw new AppError("Cannot create section for an inactive class", 400);
  }

  const existingSection = await findSectionByNameAndClass(name, classId);

  if (existingSection) {
    throw new AppError(
      "Section with this name already exists in this class",
      400,
    );
  }

  const section = await createSection(sectionData);

  return section;
};
