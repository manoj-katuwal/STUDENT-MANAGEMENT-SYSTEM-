import AppError from "../../shared/utils/error/AppError.js";
import mongoose from "mongoose";
import {
  findStudentFeeById,
  updatePaymentStatus,
} from "../studentFee/studentFee.repository.js";
import {
  countPayments,
  createPayment,
  findPaymentById,
  findPaymentByTransactionId,
  findPayments,
  findPaymentsByStudentFeeId,
} from "./payment.repository.js";
import { generateReceiptNumber } from "../receipt/receiptCounter.service.js";
import { createReceiptService } from "../receipt/receipt.service.js";
import { logActivity } from "../auditLog/auditLog.service.js";
import Student from "../students/student.model.js";
import { sendNotification } from "../notification/notification.service.js";
import logger from "../../config/logger.js";

export const createOfflinePaymentService = async (paymentData, performedBy) => {
  const { studentFeeId, amount, paymentMethod, transactionId, remarks } =
    paymentData;
  const paymentAmount = Number(amount);

  // 1. Required fields
  if (!studentFeeId) {
    throw new AppError("Student fee is required", 400);
  }

  if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
    throw new AppError("Payment amount is required", 400);
  }

  if (!paymentMethod) {
    throw new AppError("Payment method is required", 400);
  }

  // 2. Validate offline payment method
  const offlineMethods = ["CASH", "BANK_TRANSFER", "CHEQUE"];

  if (!offlineMethods.includes(paymentMethod)) {
    throw new AppError("Invalid offline payment method", 400);
  }

  // 3. Find StudentFee
  const studentFee = await findStudentFeeById(studentFeeId);

  if (!studentFee) {
    throw new AppError("Student fee not found", 404);
  }

  // 4. Cannot pay cancelled fee
  if (studentFee.status === "CANCELLED") {
    throw new AppError("Cannot make payment for a cancelled student fee", 400);
  }

  // 5. Transaction ID validation
  if (transactionId) {
    const existingPayment = await findPaymentByTransactionId(transactionId);

    if (existingPayment) {
      throw new AppError("Transaction ID already exists", 409);
    }
  }

  // 6. Create payment
  const payment = await createPayment({
    studentFeeId,
    amount: paymentAmount,
    paymentMethod,
    paymentType: "OFFLINE",
    paymentStatus: "SUCCESS",
    transactionId: transactionId || null,
    gateway: null,
    paidAt: new Date(),
    remarks: remarks || null,
  });

  // 7. Atomically update the fee only when enough amount is still due.
  const updatedStudentFee = await updatePaymentStatus(
    studentFeeId,
    paymentAmount,
  );

  if (!updatedStudentFee) {
    throw new AppError(
      "Payment could not be processed because the due amount has changed",
      409,
    );
  }

  updatedStudentFee.status =
    updatedStudentFee.dueAmount === 0 ? "PAID" : "PARTIAL";
  await updatedStudentFee.save();

  const receiptNumber = await generateReceiptNumber();
  await createReceiptService({
    paymentId: payment._id,
    studentFeeId: payment.studentFeeId,
    receiptNumber,
    amount: payment.amount,
    paymentMethod: payment.paymentMethod,
    paymentType: payment.paymentType,
    paidAt: payment.paidAt,
  });

  await logActivity({
    entityType: "Payment",
    entityId: payment._id,
    action: "CREATED",
    description: "Offline payment recorded",
    performedBy,
  });
  logger.info("Offline payment recorded", {
    paymentId: payment._id,
    studentFeeId: payment.studentFeeId,
    performedBy,
  });

  try {
    const student = await Student.findById(studentFee.studentId).populate(
      "userId",
      "email",
    );
    const recipientEmail = student?.userId?.email;

    if (recipientEmail) {
      await sendNotification({
        entityType: "Payment",
        entityId: payment._id,
        eventType: "PAYMENT_RECEIVED",
        recipientEmail,
        templateData: {
          studentName: student.name,
          amount: payment.amount,
          date: payment.paidAt.toISOString().slice(0, 10),
        },
      });
    } else {
      logger.warn(
        "Payment receipt notification skipped: student email unavailable",
        { paymentId: payment._id, studentId: studentFee.studentId },
      );
    }
  } catch (err) {
    logger.error("Payment receipt notification setup failed", {
      paymentId: payment._id,
      err,
    });
  }

  return payment;
};

export const getStudentFeePaymentHistoryService = async (studentFeeId) => {
  const studentFee = await findStudentFeeById(studentFeeId);

  if (!studentFee) {
    throw new AppError("Student fee not found", 404);
  }

  const payments = await findPaymentsByStudentFeeId(studentFeeId);

  return payments;
};

export const getPaymentByIdService = async (paymentId) => {
  const payment = await findPaymentById(paymentId);

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  return payment;
};

export const getPaymentsService = async ({
  studentFeeId,
  paymentMethod,
  paymentType,
  paymentStatus,
  gateway,
  page = 1,
  limit = 10,
}) => {
  const filter = {};

  if (studentFeeId) {
    filter.studentFeeId = studentFeeId;
  }

  if (paymentMethod) {
    filter.paymentMethod = paymentMethod;
  }

  if (paymentType) {
    filter.paymentType = paymentType;
  }

  if (paymentStatus) {
    filter.paymentStatus = paymentStatus;
  }

  if (gateway) {
    filter.gateway = gateway;
  }

  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    findPayments({
      filter,
      skip,
      limit,
    }),

    countPayments(filter),
  ]);

  return {
    payments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
