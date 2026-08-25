import StudentFee from "../studentFee/studentFee.model.js";
import Student from "../student/student.model.js";

export const getFeeCollectionCursor = async (filters) => {
  const query = {};

  if (filters.classId) {
    const students = await Student.find({ classId: filters.classId }).select(
      "_id",
    );
    query.studentId = { $in: students.map((s) => s._id) };
  }

  if (filters.academicYearId) query.academicYearId = filters.academicYearId;
  if (filters.status) query.status = filters.status;
  if (filters.startDate || filters.endDate) {
    query.dueDate = {};
    if (filters.startDate) query.dueDate.$gte = new Date(filters.startDate);
    if (filters.endDate) query.dueDate.$lte = new Date(filters.endDate);
  }

  return StudentFee.find(query)
    .populate("studentId", "name rollNumber classId")
    .populate("academicYearId", "name")
    .cursor();
};
