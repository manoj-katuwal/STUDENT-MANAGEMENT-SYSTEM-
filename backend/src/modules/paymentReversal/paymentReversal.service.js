import AppError from "../../shared/utils/error/AppError.js";
import { findPaymentById } from "../payment/payment.repository.js";
import { findStudentFeeById } from "../studentFee/studentFee.repository.js";
import PaymentReversal from "./paymentReversal.model.js";
import { createPaymentReversal, findReversalById } from "./paymentReversal.repository.js";
import { logActivity } from "../auditLog/auditLog.service.js";
import logger from "../../config/logger.js";


export const reversePaymentService = async (
  paymentId,
  reason,
  reversedByUserId,
) => {
  const payment = await findPaymentById(paymentId);
  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  if (payment.paymentStatus !== "SUCCESS") {
    throw new AppError(
      `Cannot reverse a payment with status ${payment.paymentStatus}`,
      400,
    );
  }

  const studentFee = await findStudentFeeById(payment.studentFeeId);
  if (!studentFee) {
    throw new AppError("Associated student fee record not found", 404);
  }

  const newPaidAmount = studentFee.paidAmount - payment.amount;
  if (newPaidAmount < 0) {
    throw new AppError(
      "Reversal amount exceeds recorded paid amount for this fee",
      400,
    );
  }


  let reversal;
  try {
    reversal = await createPaymentReversal({
      paymentId: payment._id,
      studentFeeId: studentFee._id,
      amount: payment.amount,
      reason,
      reversedBy: reversedByUserId,
    });
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError("This payment has already been reversed", 400);
    }
    throw err;
  }

  // Step 2: Payment + StudentFee mutate
  payment.paymentStatus = "REVERSED";

  studentFee.paidAmount = newPaidAmount;
  studentFee.dueAmount = studentFee.netAmount - newPaidAmount;
  studentFee.status =
    newPaidAmount === 0
      ? "PENDING"
      : newPaidAmount < studentFee.netAmount
        ? "PARTIAL"
        : "PAID";

  try {
    await payment.save();
    await studentFee.save();
  } catch (err) {
    // manual rollback — no transactions available on standalone Mongo
    await PaymentReversal.findByIdAndDelete(reversal._id);
    throw new AppError(
      "Failed to complete payment reversal, please retry",
      500,
    );
  }

  const completedReversal = await findReversalById(reversal._id);

  await logActivity({
    entityType: "PaymentReversal",
    entityId: reversal._id,
    action: "REVERSED",
    description: "Payment reversed",
    performedBy: reversedByUserId,
  });
  logger.info("Payment reversed", {
    paymentId: payment._id,
    paymentReversalId: reversal._id,
    performedBy: reversedByUserId,
  });

  return completedReversal;
};
