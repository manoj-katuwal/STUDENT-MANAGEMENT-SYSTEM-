import AppError from "../../shared/utils/error/AppError.js";
import {
  createStudent,
  findStudentByAdmissionNumber,
  findStudents,
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
