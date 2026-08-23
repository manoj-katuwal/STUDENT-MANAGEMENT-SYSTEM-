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
