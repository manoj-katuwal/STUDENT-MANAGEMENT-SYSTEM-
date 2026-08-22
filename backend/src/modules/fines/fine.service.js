import {
  getOverdueStudentFees,
  updateStudentFee,
} from "../studentFee/studentFee.repository.js";
import {
  createFine,
  findActiveFineByStudentFeeAndPolicy,
  getTotalActiveFineByStudentFeeId,
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

    if (!policies.length) {
      continue;
    }

    const today = new Date();
    const dueDate = new Date(studentFee.dueDate);
    const rawOverdueDays = Math.floor(
      (today - dueDate) / (1000 * 60 * 60 * 24),
    );

    for (const policy of policies) {
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

      if (existingFine) {
        if (existingFine.amount === cappedFine) {
          continue;
        }

        const fine = await updateFine(existingFine._id, {
          amount: cappedFine,
          overdueDays: effectiveOverdueDays,
          lastCalculatedAt: today,
        });
        results.push(fine);
      } else {
        const fine = await createFine({
          studentFeeId: studentFee._id,
          finePolicyId: policy._id,
          amount: cappedFine,
          overdueDays: effectiveOverdueDays,
          status: "ACTIVE",
          lastCalculatedAt: today,
        });
        results.push(fine);
      }
    }

    const totalFineAmount = await getTotalActiveFineByStudentFeeId(
      studentFee._id,
    );
    const baseDueAmount = Math.max(
      0,
      studentFee.netAmount - studentFee.paidAmount,
    );

    await updateStudentFee(studentFee._id, {
      fineAmount: totalFineAmount,
      dueAmount: baseDueAmount + totalFineAmount,
    });
  }

  return results;
};
