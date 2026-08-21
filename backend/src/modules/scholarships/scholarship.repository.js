import Scholarship from "./scholarship.model.js";

export const createScholarship = async (data) => {
  return await Scholarship.create(data);
};

export const findScholarshipById = async (id) => {
  return await Scholarship.findById(id);
};

export const findActiveScholarshipsByStudentAndYear = async (
  studentId,
  academicYearId,
) => {
  return await Scholarship.find({
    studentId,
    academicYearId,
    status: "ACTIVE",
  });
};
