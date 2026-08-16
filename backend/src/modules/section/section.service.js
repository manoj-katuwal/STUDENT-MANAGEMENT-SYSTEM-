import {
  countSections,
  createSection,
  findSectionById,
  findSectionByNameAndClass,
  findSections,
  updateSection,
  updateSectionStatus,
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

export const getSectionsService = async (
  page = 1,
  limit = 10,
  search = "",
  classId = "",
) => {
  const skip = (page - 1) * limit;

  const filter = {};

  if (search) {
    filter.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (classId) {
    filter.classId = classId;
  }

  const [sections, total] = await Promise.all([
    findSections(filter, skip, limit),
    countSections(filter),
  ]);

  return {
    sections,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getSectionByIdService = async (sectionId) => {
  const section = await findSectionById(sectionId);

  if (!section) {
    throw new AppError("Section not found", 404);
  }

  return section;
};

export const updateSectionService = async (sectionId, updateData) => {
  const section = await findSectionById(sectionId);

  if (!section) {
    throw new AppError("Section not found", 404);
  }

  const newClassId = updateData.classId || section.classId;
  const newName = updateData.name || section.name;

  const classRecord = await findClassById(newClassId);

  if (!classRecord) {
    throw new AppError("Class not found", 404);
  }

  if (classRecord.status === "INACTIVE") {
    throw new AppError("Cannot assign section to an inactive class", 400);
  }

  const existingSection = await findSectionByNameAndClass(newName, newClassId);

  if (existingSection && existingSection._id.toString() !== sectionId) {
    throw new AppError(
      "Section with this name already exists in this class",
      400,
    );
  }

  return await updateSection(sectionId, updateData);
};


export const updateSectionStatusService = async (sectionId, status) => {
  const section = await findSectionById(sectionId);

  if (!section) {
    throw new AppError("Section not found", 404);
  }

  if (section.status === status) {
    throw new AppError(`Section is already ${status.toLowerCase()}`, 400);
  }

  return await updateSectionStatus(sectionId, status);
};
