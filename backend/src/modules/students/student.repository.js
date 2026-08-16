import Student from "./student.model.js";

export const createStudent = async (studentData) => {
  return await Student.create(studentData);
};

export const findStudentById = async (studentId) => {
  return await Student.findById(studentId)
    .populate("classId", "name code")
    .populate("sectionId", "name");
};

export const findStudentByAdmissionNumber = async (admissionNumber) => {
  return await Student.findOne({ admissionNumber });
};

// export const findStudents = async (filter = {}) => {
//   return await Student.find(filter);
// };

export const updateStudent = async (studentId, updateData) => {
  return await Student.findByIdAndUpdate(studentId, updateData, {
    new: true,
    runValidators: true,
  });
};

export const findStudents = async ({
  filter = {},
  skip = 0,
  limit = 10,
} = {}) => {
  return await Student.find(filter)
    .populate("classId", "name code")
    .populate("sectionId", "name")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
};

export const countStudents = async (filter = {}) => {
  return await Student.countDocuments(filter);
};
