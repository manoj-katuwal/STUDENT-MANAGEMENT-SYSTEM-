import * as paymentRepository from "./payment.repository.js";
import * as studentFeeRepository from "../studentFee/studentFee.repository.js";
import { updateStudentFee } from "../studentFee/studentFee.repository.js";
import AppError from "../../shared/utils/error/AppError.js";

const OFFLINE_METHODS = ["CASH", "BANK_TRANSFER", "CHEQUE"];

export const createOfflinePayment = async ({
  studentFeeId,
  amount,
  paymentMethod,
  remarks,
}) => {
  if (!OFFLINE_METHODS.includes(paymentMethod)) {
    throw new AppError("Invalid offline payment method", 400);
  }

  if (amount <= 0) {
    throw new AppError("Amount must be greater than 0", 400);
  }

  const studentFee =
    await studentFeeRepository.findStudentFeeById(studentFeeId);

  if (!studentFee) {
    throw new AppError("StudentFee not found", 404);
  }

  if (studentFee.status === "CANCELLED") {
    throw new AppError("Cannot accept payment for a cancelled fee", 400);
  }

  const currentPaid = await paymentRepository.getTotalPaidAmount(studentFeeId);

  const currentDue = studentFee.netAmount - currentPaid;

  if (amount > currentDue) {
    throw new AppError(`Payment exceeds due amount. Due: ${currentDue}`, 400);
  }

  const payment = await paymentRepository.create({
    studentFeeId,
    amount,
    paymentMethod,
    paymentType: "OFFLINE",
    paymentStatus: "SUCCESS",
    remarks,
  });

  const newPaidAmount = currentPaid + amount;
  const newDueAmount = studentFee.netAmount - newPaidAmount;

  let newStatus = "PARTIAL";
  if (newDueAmount === 0) {
    newStatus = "PAID";
  } else if (newPaidAmount === 0) {
    newStatus = "PENDING";
  }

  const updatedStudentFee = await updateStudentFee(studentFeeId, {
    paidAmount: newPaidAmount,
    dueAmount: newDueAmount,
    status: newStatus,
  });

  return {
    payment,
    studentFee: updatedStudentFee,
  };
};

export const getPaymentHistory = async (studentFeeId) => {
  const studentFee = await studentFeeRepository.findStudentFeeById(studentFeeId);

  if (!studentFee) {
    throw new AppError("StudentFee not found", 404);
  }

  const payments = await paymentRepository.findByStudentFeeId(studentFeeId);

  return {
    studentFee,
    payments,
  };
};

export const getReceipt = async (paymentId) => {
  const payment = await paymentRepository.findById(paymentId);

  if (!payment) {
    throw new AppError("Payment not found", 404);
  }

  if (payment.paymentStatus !== "SUCCESS") {
    throw new AppError(
      "Receipt is only available for successful payments",
      400,
    );
  }

  const studentFee = await studentFeeRepository.findStudentFeeById(payment.studentFeeId);

  return {
    receiptNo: `RCPT-${payment._id.toString().slice(-8).toUpperCase()}`,
    paymentId: payment._id,
    amount: payment.amount,
    paymentMethod: payment.paymentMethod,
    paidAt: payment.paidAt,
    remarks: payment.remarks,
    studentFee: {
      netAmount: studentFee.netAmount,
      paidAmount: studentFee.paidAmount,
      dueAmount: studentFee.dueAmount,
      status: studentFee.status,
    },
  };
};
