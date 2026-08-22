import { getOverdueStudentFees } from "../studentFee/studentFee.repository.js";
import {
  createFine,
  findActiveFineByStudentFeeAndPolicy,
  updateFine,
} from "./fine.repository.js";
import { findActiveFinePoliciesByFeeType } from "./finePolicy/finePolicy.repository.js";

export const calculateAndApplyFinesService = async () => {
  const overdueStudentFees = await getOverdueStudentFees();

  const results = [];

  for (const studentFee of overdueStudentFees) {
    const policies = await findActiveFinePoliciesByFeeType(
      studentFee.academicYearId,
      studentFee.feeStructureId.feeType,
    );

    if (!policies || policies.length === 0) {
      continue;
    }

    const policy = policies[0];

    const today = new Date();
    const dueDate = new Date(studentFee.dueDate);

    const rawOverdueDays = Math.floor(
      (today - dueDate) / (1000 * 60 * 60 * 24),
    );

    const effectiveOverdueDays = rawOverdueDays - policy.gracePeriodDays;

    if (effectiveOverdueDays <= 0) {
      continue;
    }

    let calculatedFine;

    if (policy.type === "DAILY_FIXED") {
      calculatedFine = effectiveOverdueDays * policy.amount;
    } else if (policy.type === "FIXED") {
      calculatedFine = policy.amount;
    } else {
      continue;
    }

    const cappedFine = Math.min(calculatedFine, policy.maxFineAmount);

    const existingFine = await findActiveFineByStudentFeeAndPolicy(
      studentFee._id,
      policy._id,
    );

    let fine;

    if (existingFine) {
      if (existingFine.amount === cappedFine) {
        continue; // कुनै परिवर्तन भएन, skip
      }

      fine = await updateFine(existingFine._id, {
        amount: cappedFine,
        overdueDays: effectiveOverdueDays,
        lastCalculatedAt: today,
      });
    } else {
      fine = await createFine({
        studentFeeId: studentFee._id,
        finePolicyId: policy._id,
        amount: cappedFine,
        overdueDays: effectiveOverdueDays,
        status: "ACTIVE",
        lastCalculatedAt: today,
      });
    }

    const baseDue = studentFee.netAmount - studentFee.paidAmount;
    const newDueAmount = baseDue + cappedFine;

    await updateStudentFee(studentFee._id, {
      fineAmount: cappedFine,
      dueAmount: newDueAmount,
    });

    results.push(fine);
  }

  return results;
};
