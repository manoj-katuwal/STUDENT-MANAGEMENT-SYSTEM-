import AppError from "../../shared/utils/error/AppError.js";
import { findStudentFeeById, updateStudentFee } from "../studentFee/studentFee.repository.js";
import { createDiscount, findActiveDiscountByStudentFeeId } from "./discount.repository.js";

export const applyDiscountService = async ({
  studentFeeId,
  type,
  value,
  reason,
  appliedBy,
}) => {
  const studentFee = await findStudentFeeById(studentFeeId);

  if (!studentFee) {
    throw new AppError("Student fee not found", 404);
  }

  const existingDiscount = await findActiveDiscountByStudentFeeId(studentFeeId);

  if (existingDiscount) {
    throw new AppError(
      "An active discount already exists for this student fee",
      400,
    );
  }

  if (!["FIXED", "PERCENTAGE"].includes(type)) {
    throw new AppError("Invalid discount type", 400);
  }

  if (!value || value <= 0) {
    throw new AppError("Discount value must be greater than 0", 400);
  }

  let calculatedAmount;

  if (type === "FIXED") {
    calculatedAmount = value;
  }

  if (type === "PERCENTAGE") {
    if (value > 100) {
      throw new AppError("Percentage discount cannot be greater than 100", 400);
    }

    calculatedAmount = (studentFee.totalAmount * value) / 100;
  }

  if (calculatedAmount > studentFee.totalAmount) {
    throw new AppError(
      "Discount amount cannot be greater than total fee amount",
      400,
    );
  }
    const newNetAmount = studentFee.totalAmount - calculatedAmount;

    if (newNetAmount < studentFee.paidAmount) {
      throw new AppError(
        "Discount cannot reduce net amount below the amount already paid",
        400,
      );
    }

      const newDueAmount = newNetAmount - studentFee.paidAmount;

      const discount = await createDiscount({
        studentFeeId,
        type,
        value,
        calculatedAmount,
        reason,
        appliedBy,
        status: "ACTIVE",
      });

      const updatedStudentFee = await updateStudentFee(studentFeeId, {
        discountAmount: calculatedAmount,
        netAmount: newNetAmount,
        dueAmount: newDueAmount,
        status: newDueAmount === 0 ? "PAID" : studentFee.status,
      });

      return {
        discount,
        studentFee: updatedStudentFee,
      };
};
