import mongoose from "mongoose";

import AppError from "../../shared/utils/error/AppError.js";
import { logActivity } from "../auditLog/auditLog.service.js";
import { findPaymentById } from "../payment/payment.repository.js";
import { findStudentFeeById } from "../studentFee/studentFee.repository.js";
import Student from "../students/student.model.js";
import { sendNotification } from "../notification/notification.service.js";
import logger from "../../config/logger.js";
import {
  createPaymentReversal,
  findReversalById,
} from "./paymentReversal.repository.js";

export const reversePaymentService = async (
  paymentId,
  reason,
  reversedByUserId,
) => {
  const session = await mongoose.startSession();
  let payment;
  let studentFee;
  let reversal;

  try {
    session.startTransaction();

    // Every record involved in the reversal is read and changed in the same
    // transaction, so a failure leaves the payment and fee untouched.
    payment = await findPaymentById(paymentId, { session });
    if (!payment) {
      throw new AppError("Payment not found", 404);
    }

    if (payment.paymentStatus !== "SUCCESS") {
      throw new AppError(
        `Cannot reverse a payment with status ${payment.paymentStatus}`,
        400,
      );
    }

    const studentFeeId = payment.studentFeeId?._id ?? payment.studentFeeId;
    studentFee = await findStudentFeeById(studentFeeId, {
      session,
    });
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

    reversal = await createPaymentReversal(
      {
        paymentId: payment._id,
        studentFeeId: studentFee._id,
        amount: payment.amount,
        reason,
        reversedBy: reversedByUserId,
      },
      { session },
    );

    payment.paymentStatus = "REVERSED";
    studentFee.paidAmount = newPaidAmount;
    studentFee.dueAmount = studentFee.netAmount - newPaidAmount;
    studentFee.status =
      newPaidAmount === 0
        ? "PENDING"
        : newPaidAmount < studentFee.netAmount
          ? "PARTIAL"
          : "PAID";

    await payment.save({ session });
    await studentFee.save({ session });
    await logActivity(
      {
        entityType: "PaymentReversal",
        entityId: reversal._id,
        action: "REVERSED",
        description: "Payment reversed",
        performedBy: reversedByUserId,
      },
      { session },
    );

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();

    if (error?.code === 11000) {
      throw new AppError("This payment has already been reversed", 400);
    }

    throw error;
  } finally {
    await session.endSession();
  }

  const completedReversal = await findReversalById(reversal._id);

  logger.info("Payment reversed", {
    paymentId: payment._id,
    paymentReversalId: reversal._id,
    performedBy: reversedByUserId,
  });

  // Notification delivery is intentionally after commit: an email failure
  // must never undo a completed financial reversal.
  try {
    const student = await Student.findById(studentFee.studentId).populate(
      "userId",
      "email",
    );
    const recipientEmail = student?.userId?.email;

    if (recipientEmail) {
      await sendNotification({
        entityType: "PaymentReversal",
        entityId: reversal._id,
        eventType: "PAYMENT_REVERSED",
        recipientEmail,
        templateData: {
          studentName: student.name,
          amount: payment.amount,
          reason,
        },
      });
    } else {
      logger.warn("Payment reversal notification skipped: student email unavailable", {
        paymentId: payment._id,
        studentId: studentFee.studentId,
      });
    }
  } catch (error) {
    logger.error("Payment reversal notification setup failed", {
      paymentId: payment._id,
      paymentReversalId: reversal._id,
      error,
    });
  }

  return completedReversal;
};
