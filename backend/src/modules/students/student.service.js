import AppError from "../../shared/utils/error/AppError.js";
import {
  createStudent,
  findStudentByAdmissionNumber,
  findStudentById,
  findStudents,
  updateStudent,
} from "./student.repository.js";

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

  const student = await createStudent(studentData);

  return student;
};

export const getStudentsService = async () => {
  const students = await findStudents();

  return students;
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

  const updatedStudent = await updateStudent(studentId, updateData);

  return updatedStudent;
};
