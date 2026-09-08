import AppError from "../../shared/utils/error/AppError.js";

import {
  countStudents,
  createStudent,
  findStudentByAdmissionNumber,
  findStudentById,
  findStudents,
  findStudentsForExport,
  getStudentStats,
  updateStudent,
} from "./student.repository.js";

import { findClassById } from "../classes/class.repository.js";
import { findSectionById } from "../section/section.repository.js";

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n") ||
    stringValue.includes("\r")
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
};

const formatDateSafe = (dateVal, dateOnly = false) => {
  if (!dateVal) return "";
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "";
    return dateOnly ? d.toISOString().slice(0, 10) : d.toISOString();
  } catch {
    return "";
  }
};

const studentToCsvRow = (student) => {
  return [
    student.admissionNumber || "",
    student.name || "",
    student.classId?.name || "",
    student.classId?.code || "",
    student.sectionId?.name || "",
    formatDateSafe(student.dateOfBirth, true),
    student.gender || "",
    student.phone || "",
    student.address || "",
    student.guardian?.name || "",
    student.guardian?.relationship || "",
    student.guardian?.phone || "",
    student.status || "",
    formatDateSafe(student.createdAt, false),
  ]
    .map(escapeCsvValue)
    .join(",");
};

const generateStudentsCsv = (students) => {
  const headers = [
    "Admission Number",
    "Name",
    "Class",
    "Class Code",
    "Section",
    "Date of Birth",
    "Gender",
    "Phone",
    "Address",
    "Guardian Name",
    "Guardian Relationship",
    "Guardian Phone",
    "Status",
    "Created At",
  ];

  const rows = students.map(studentToCsvRow);

  return [headers.join(","), ...rows].join("\r\n");
};

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

const buildStudentFilter = ({
  search = "",
  classId = "",
  sectionId = "",
} = {}) => {
  const filter = {};
  const cleanSearch = typeof search === "string" ? search.trim() : "";
  const cleanClassId = typeof classId === "string" ? classId.trim() : "";
  const cleanSectionId = typeof sectionId === "string" ? sectionId.trim() : "";

  if (cleanSearch) {
    filter.$or = [
      {
        name: {
          $regex: cleanSearch,
          $options: "i",
        },
      },
      {
        admissionNumber: {
          $regex: cleanSearch,
          $options: "i",
        },
      },
    ];
  }

  if (cleanClassId) {
    filter.classId = cleanClassId;
  }

  if (cleanSectionId) {
    filter.sectionId = cleanSectionId;
  }

  return filter;
};

export const getStudentsService = async (
  page = 1,
  limit = 10,
  search = "",
  classId = "",
  sectionId = "",
) => {
  const cleanClassId = typeof classId === "string" ? classId.trim() : "";
  const cleanSectionId = typeof sectionId === "string" ? sectionId.trim() : "";
  const cleanSearch = typeof search === "string" ? search.trim() : "";

  if (cleanSectionId) {
    const section = await findSectionById(cleanSectionId);

    if (!section) {
      throw new AppError("Section not found", 404);
    }

    if (
      cleanClassId &&
      section.classId.toString() !== cleanClassId.toString()
    ) {
      throw new AppError("Section does not belong to the selected class", 400);
    }
  }
  const skip = (page - 1) * limit;

  const filter = buildStudentFilter({
    search: cleanSearch,
    classId: cleanClassId,
    sectionId: cleanSectionId,
  });

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

export const getStudentStatsService = async () => {
  return await getStudentStats();
};

export const getStudentsForExportService = async ({
  search = "",
  classId = "",
  sectionId = "",
} = {}) => {
  const cleanClassId = typeof classId === "string" ? classId.trim() : "";
  const cleanSectionId = typeof sectionId === "string" ? sectionId.trim() : "";
  const cleanSearch = typeof search === "string" ? search.trim() : "";

  if (cleanSectionId) {
    const section = await findSectionById(cleanSectionId);

    if (!section) {
      throw new AppError("Section not found", 404);
    }

    if (
      cleanClassId &&
      section.classId.toString() !== cleanClassId.toString()
    ) {
      throw new AppError("Section does not belong to the selected class", 400);
    }
  }

  const filter = buildStudentFilter({
    search: cleanSearch,
    classId: cleanClassId,
    sectionId: cleanSectionId,
  });

  const students = await findStudentsForExport(filter);

  return generateStudentsCsv(students);
};
