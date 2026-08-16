
import AppError from "../../shared/utils/error/AppError.js";
import {
  createStudent,
  findStudentByAdmissionNumber,
} from "./student.repository.js";

export const createStudentService = async (studentData) => {
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
