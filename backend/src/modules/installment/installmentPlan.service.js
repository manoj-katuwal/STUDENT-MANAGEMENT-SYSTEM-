import AppError from "../../shared/utils/error/AppError.js";
import * as studentRepository from "../students/student.repository.js";
import * as academicYearRepository from "../academicYear/academicYear.repository.js";
import * as feeStructureRepository from "../feeStructure/feeStructure.repository.js";
import * as installmentPlanRepository from "./installmentPlan.repository.js";
import * as studentFeeRepository from "../studentFee/studentFee.repository.js";

const AMOUNT_TOLERANCE = 0.01;

const addMonths = (date, months) => {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
};

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const generateAutoDueDates = (
  startDate,
  numberOfInstallments,
  frequency,
  intervalDays,
) => {
  const dates = [];
  for (let i = 0; i < numberOfInstallments; i++) {
    if (frequency === "CUSTOM_DAYS") {
      dates.push(addDays(startDate, i * intervalDays));
    } else {
      const intervalMonths = frequency === "QUARTERLY" ? 3 : 1;
      dates.push(addMonths(startDate, i * intervalMonths));
    }
  }
  return dates;
};

export const createInstallmentPlanService = async (payload, userId) => {
  const {
    studentId,
    academicYearId,
    feeStructureId,
    totalAmount,
    numberOfInstallments,
    dueDateMode,
    frequency,
    startDate,
    intervalDays,
    installments, // client-supplied: [{ installmentNumber, amount, dueDate? }]
  } = payload;

  // 1. Referential existence checks
  const student = await studentRepository.findStudentById(studentId);
  if (!student) throw new AppError("Student फेला परेन", 404);

  const academicYear =
    await academicYearRepository.findAcademicYearById(academicYearId);
  if (!academicYear) throw new AppError("Academic Year फेला परेन", 404);

  const feeStructure =
    await feeStructureRepository.findFeeStructureById(feeStructureId);
  if (!feeStructure) throw new AppError("Fee Structure फेला परेन", 404);

  // 2. Duplicate active plan check (index-backed, but explicit check for clean error)
  const existingActive =
    await installmentPlanRepository.findActivePlanByStudentFeeContext(
      studentId,
      academicYearId,
      feeStructureId,
    );
  if (existingActive) {
    throw new AppError(
      "यो student/fee को लागि पहिल्यै एउटा ACTIVE installment plan छ",
      409,
    );
  }

  // 3. Structural validation
  if (!Array.isArray(installments)) {
    throw new AppError("installments must be an array", 400);
  }

  if (!Number.isInteger(numberOfInstallments) || numberOfInstallments < 2) {
    throw new AppError("numberOfInstallments must be an integer of at least 2", 400);
  }

  if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
    throw new AppError("totalAmount must be a positive number", 400);
  }

  if (installments.length !== numberOfInstallments) {
    throw new AppError(
      "installments array length numberOfInstallments सँग मिलेन",
      400,
    );
  }

  const installmentNumbers = new Set();
  for (let i = 0; i < installments.length; i++) {
    const installment = installments[i];
    if (
      !installment ||
      !Number.isFinite(installment.amount) ||
      installment.amount <= 0 ||
      !Number.isInteger(installment.installmentNumber) ||
      installment.installmentNumber !== i + 1 ||
      installmentNumbers.has(installment.installmentNumber)
    ) {
      throw new AppError(
        "Each installment needs a positive amount and a sequential installmentNumber",
        400,
      );
    }
    installmentNumbers.add(installment.installmentNumber);
  }

  const amountSum = installments.reduce((sum, i) => sum + i.amount, 0);
  if (Math.abs(amountSum - totalAmount) > AMOUNT_TOLERANCE) {
    throw new AppError(
      `Installment amounts को जोड (${amountSum}) totalAmount (${totalAmount}) सँग मिलेन`,
      400,
    );
  }

  // 4. Due date resolution
  let resolvedInstallments;
  if (dueDateMode === "AUTO") {
    if (!startDate || Number.isNaN(new Date(startDate).getTime())) {
      throw new AppError("AUTO mode requires a valid startDate", 400);
    }
    if (!["MONTHLY", "QUARTERLY", "CUSTOM_DAYS"].includes(frequency)) {
      throw new AppError("AUTO mode requires a valid frequency", 400);
    }
    if (
      frequency === "CUSTOM_DAYS" &&
      (!Number.isInteger(intervalDays) || intervalDays < 1)
    ) {
      throw new AppError("CUSTOM_DAYS frequency requires intervalDays of at least 1", 400);
    }
    const autoDates = generateAutoDueDates(
      startDate,
      numberOfInstallments,
      frequency,
      intervalDays,
    );
    resolvedInstallments = installments.map((inst, idx) => ({
      ...inst,
      dueDate: autoDates[idx],
    }));
  } else {
    // MANUAL: every installment must have its own dueDate, strictly ascending
    for (let i = 0; i < installments.length; i++) {
      if (!installments[i].dueDate) {
        throw new AppError(`Installment ${i + 1} को dueDate दिइएको छैन`, 400);
      }
      if (Number.isNaN(new Date(installments[i].dueDate).getTime())) {
        throw new AppError(`Installment ${i + 1} has an invalid dueDate`, 400);
      }
      if (
        i > 0 &&
        new Date(installments[i].dueDate) <=
          new Date(installments[i - 1].dueDate)
      ) {
        throw new AppError(
          "Installment dueDate हरू ascending order मा हुनुपर्छ",
          400,
        );
      }
    }
    resolvedInstallments = installments;
  }

  // 5. Create the plan first (installments[].studentFeeId still null)
  const plan = await installmentPlanRepository.createInstallmentPlan({
    studentId,
    academicYearId,
    feeStructureId,
    totalAmount,
    numberOfInstallments,
    dueDateMode,
    frequency,
    intervalDays: frequency === "CUSTOM_DAYS" ? intervalDays : undefined,
    installments: resolvedInstallments.map((inst) => ({
      installmentNumber: inst.installmentNumber,
      amount: inst.amount,
      dueDate: inst.dueDate,
      studentFeeId: null,
    })),
    status: "ACTIVE",
    createdBy: userId,
  });

  // 6. Generate a StudentFee per installment — with manual rollback on partial failure
  const createdStudentFeeIds = [];
  try {
    for (let i = 0; i < plan.installments.length; i++) {
      const inst = plan.installments[i];
      const studentFee = await studentFeeRepository.createStudentFee({
        studentId,
        academicYearId,
        feeStructureId,
        totalAmount: inst.amount,
        paidAmount: 0,
        dueAmount: inst.amount,
        netAmount: inst.amount,
        dueDate: inst.dueDate,
        status: "PENDING",
        installmentPlanId: plan._id,
        installmentNumber: inst.installmentNumber,
      });
      createdStudentFeeIds.push(studentFee._id);
      plan.installments[i].studentFeeId = studentFee._id;
    }

    await plan.save();
    return plan;
  } catch (err) {
    // Compensating rollback: standalone Mongo, no transaction available
    await studentFeeRepository.deleteManyByIds(createdStudentFeeIds);
    await installmentPlanRepository.deleteInstallmentPlanById(plan._id);
    throw new AppError(
      "Installment plan generate गर्दा समस्या भयो, rollback गरियो",
      500,
    );
  }
};
