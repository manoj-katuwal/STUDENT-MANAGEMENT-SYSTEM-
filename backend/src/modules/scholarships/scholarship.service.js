import AppError from "../../shared/utils/error/AppError.js";
import { findAcademicYearById } from "../academicYear/academicYear.repository.js";
import { findStudentById } from "../students/student.repository.js";
import { createScholarship } from "./scholarship.repository.js";

export const awardScholarshipService = async ({
  studentId,
  academicYearId,
  name,
  type,
  valueType,
  value,
  sponsor,
  startDate,
  endDate,
  createdBy,
}) => {
  const student = await findStudentById(studentId);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  const academicYear = await findAcademicYearById(academicYearId);

  if (!academicYear) {
    throw new AppError("Academic year not found", 404);
  }

  if (!["FIXED", "PERCENTAGE"].includes(valueType)) {
    throw new AppError("Invalid scholarship value type", 400);
  }

  if (!value || value <= 0) {
    throw new AppError("Scholarship value must be greater than 0", 400);
  }

  if (valueType === "PERCENTAGE" && value > 100) {
    throw new AppError(
      "Percentage scholarship cannot be greater than 100",
      400,
    );
  }

  if (new Date(endDate) <= new Date(startDate)) {
    throw new AppError("End date must be after start date", 400);
  }
  const scholarship = await createScholarship({
    studentId,
    academicYearId,
    name,
    type,
    valueType,
    value,
    sponsor: sponsor || null,
    startDate,
    endDate,
    status: "ACTIVE",
    createdBy,
  });

  return scholarship;
};
