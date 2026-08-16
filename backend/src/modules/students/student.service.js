import AppError from "../../shared/utils/error/AppError.js";
import {
    countStudents,
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

export const updateStudentStatusService = async (studentId, status) => {
  const student = await findStudentById(studentId);

  if (!student) {
    throw new AppError("Student not found", 404);
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

