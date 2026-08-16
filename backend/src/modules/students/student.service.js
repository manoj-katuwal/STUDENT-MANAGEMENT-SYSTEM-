import AppError from "../../shared/utils/error/AppError.js";

import {
  countStudents,
  createStudent,
  findStudentByAdmissionNumber,
  findStudentById,
  findStudents,
  updateStudent,
} from "./student.repository.js";

import { findClassById } from "../classes/class.repository.js";
import { findSectionById } from "../section/section.repository.js";

const validateAcademicAssignment = async (classId, sectionId) => {
  if (!classId) {
    throw new AppError("Class is required", 400);
  }

  if (!sectionId) {
    throw new AppError("Section is required", 400);
  }

  const classRecord = await findClassById(classId);

  if (!classRecord) {
    throw new AppError("Class not found", 404);
  }

  if (classRecord.status === "INACTIVE") {
    throw new AppError("Cannot assign student to an inactive class", 400);
  }

  const section = await findSectionById(sectionId);

  if (!section) {
    throw new AppError("Section not found", 404);
  }

  if (section.status === "INACTIVE") {
    throw new AppError("Cannot assign student to an inactive section", 400);
  }

  if (section.classId.toString() !== classId.toString()) {
    throw new AppError("Section does not belong to the selected class", 400);
  }
};

export const createStudentService = async (studentData) => {
  if (!studentData || !studentData.admissionNumber) {
    throw new AppError("Admission number is required", 400);
  }

  const existingStudent = await findStudentByAdmissionNumber(
    studentData.admissionNumber,
  );

  if (existingStudent) {
    throw new AppError(
      "Student with this admission number already exists",
      400,
    );
  }

  await validateAcademicAssignment(studentData.classId, studentData.sectionId);

  const student = await createStudent(studentData);

  return student;
};

export const getStudentByIdService = async (studentId) => {
  const student = await findStudentById(studentId);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  return student;
};

export const updateStudentService = async (studentId, updateData) => {
  const student = await findStudentById(studentId);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  // Admission number duplicate check
  if (
    updateData.admissionNumber &&
    updateData.admissionNumber !== student.admissionNumber
  ) {
    const existingStudent = await findStudentByAdmissionNumber(
      updateData.admissionNumber,
    );

    if (existingStudent) {
      throw new AppError(
        "Student with this admission number already exists",
        400,
      );
    }
  }

  if (updateData.classId || updateData.sectionId) {
    const existingClassId = student.classId?._id || student.classId;

    const existingSectionId = student.sectionId?._id || student.sectionId;

    const classId = updateData.classId || existingClassId;

    const sectionId = updateData.sectionId || existingSectionId;

    await validateAcademicAssignment(classId, sectionId);
  }

  const updatedStudent = await updateStudent(studentId, updateData);

  return updatedStudent;
};

export const updateStudentStatusService = async (studentId, status) => {
  const student = await findStudentById(studentId);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  if (student.status === status) {
    throw new AppError(`Student is already ${status.toLowerCase()}`, 400);
  }

  const updatedStudent = await updateStudent(studentId, {
    status,
  });

  return updatedStudent;
};

export const getStudentsService = async (page = 1, limit = 10, search = "") => {
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
        admissionNumber: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const [students, total] = await Promise.all([
    findStudents({
      filter,
      skip,
      limit,
    }),
    countStudents(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    students,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};
