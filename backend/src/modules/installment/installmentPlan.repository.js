import InstallmentPlan from "./installmentPlan.model.js";

export const createInstallmentPlan = async (planData) => {
  const plan = await InstallmentPlan.create(planData);
  return plan;
};

export const findActivePlanByStudentFeeContext = async (
  studentId,
  academicYearId,
  feeStructureId,
) => {
  return InstallmentPlan.findOne({
    studentId,
    academicYearId,
    feeStructureId,
    status: "ACTIVE",
  });
};

export const findInstallmentPlanById = async (planId) => {
  return InstallmentPlan.findById(planId);
};

export const deleteInstallmentPlanById = async (planId) => {
  return InstallmentPlan.findByIdAndDelete(planId);
};

export const findInstallmentPlanByIdPopulated = async (planId) => {
  return InstallmentPlan.findById(planId)
    .populate("studentId", "name admissionNumber classId sectionId")
    .populate("academicYearId", "name")
    .populate("feeStructureId", "name totalAmount")
    .populate("installments.studentFeeId");
};

export const findInstallmentPlansByStudent = async (
  studentId,
  filters = {},
  page = 1,
  limit = 10,
) => {
  const query = { studentId };
  if (filters.status) query.status = filters.status;

  const skip = (page - 1) * limit;

  const [plans, total] = await Promise.all([
    InstallmentPlan.find(query)
      .populate("feeStructureId", "name totalAmount")
      .populate("academicYearId", "name")
      .select("-installments.studentFeeId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    InstallmentPlan.countDocuments(query),
  ]);

  return { plans, total, page, limit };
};

export const cancelUnpaidByIds = async (ids) => {
  if (!ids || ids.length === 0) return { modifiedCount: 0 };
  return StudentFee.updateMany(
    { _id: { $in: ids }, paidAmount: 0 },
    { $set: { status: "CANCELLED" } },
  );
};
