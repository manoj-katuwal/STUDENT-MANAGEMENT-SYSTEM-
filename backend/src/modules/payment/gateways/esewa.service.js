import mongoose from "mongoose";
import AppError from "../../../shared/utils/error/AppError.js";
import * as studentFeeRepository from "../../studentFee/studentFee.repository.js";
import * as paymentRepository from "../payment.repository.js";
import { buildEsewaPaymentPayload, checkEsewaStatus, decodeEsewaCallback, verifyEsewaSignature } from "./esewa.gateway.js";


const ONLINE_GATEWAYS = ["ESEWA"];

export const initiateOnlinePaymentService = async ({
  studentFeeId,
  amount,
  gateway,
}) => {
  if (!ONLINE_GATEWAYS.includes(gateway)) {
    throw new AppError("Unsupported payment gateway", 400);
  }

  if (amount <= 0) {
    throw new AppError("Amount must be greater than 0", 400);
  }

  const studentFee = await studentFeeRepository.findStudentFeeById(studentFeeId);

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

  // PENDING payment record पहिले नै बनाउने — transaction_uuid को रूपमा यसैको _id प्रयोग गर्ने
  const pendingPayment = await paymentRepository.create({
    studentFeeId,
    amount,
    paymentMethod: gateway,
    paymentType: "ONLINE",
    paymentStatus: "PENDING",
    gateway,
  });

  const transactionUuid = pendingPayment._id.toString();

  // यही transactionUuid लाई payment मा पनि save गर्ने, पछि lookup गर्न सजिलो होस्
  await paymentRepository.updateStatus(pendingPayment._id, "PENDING");
  pendingPayment.transactionId = transactionUuid;
  await pendingPayment.save();

  const { paymentUrl, formData } = buildEsewaPaymentPayload({
    amount,
    transactionUuid,
  });

  return {
    paymentId: pendingPayment._id,
    paymentUrl,
    formData,
  };
};

export const verifyOnlinePaymentService = async (base64Data) => {
  const decoded = decodeEsewaCallback(base64Data);

  // 1. Signature verify (tampering check)
  const isSignatureValid = verifyEsewaSignature(decoded);

  if (!isSignatureValid) {
    throw new AppError("Invalid payment signature", 400);
  }

  const { transaction_uuid: transactionUuid, total_amount: totalAmount } =
    decoded;

  const payment = await paymentRepository.findById(transactionUuid);

  if (!payment) {
    throw new AppError("Payment record not found", 404);
  }

  if (payment.paymentStatus === "SUCCESS") {
    // पहिले नै processed भएको — duplicate callback, idempotent response फर्काउने
    return { alreadyProcessed: true, payment };
  }

  // 2. Defense in depth — eSewa को status API लाई सिधै call गर्ने
  const statusResult = await checkEsewaStatus({
    totalAmount,
    transactionUuid,
  });

  if (statusResult.status !== "COMPLETE") {
    payment.paymentStatus = "FAILED";
    await payment.save();

    throw new AppError(
      `Payment not completed. Gateway status: ${statusResult.status}`,
      400,
    );
  }

  // 3. साँच्चै verified भयो — अब मात्र StudentFee update गर्ने
  const studentFee = await studentFeeRepository.findStudentFeeById(payment.studentFeeId);

  const currentPaid = await paymentRepository.getTotalPaidAmount(
    payment.studentFeeId,
  );

  const newPaidAmount = currentPaid + payment.amount;
  const newDueAmount = studentFee.netAmount - newPaidAmount;

  let newStatus = "PARTIAL";
  if (newDueAmount === 0) {
    newStatus = "PAID";
  }

  payment.paymentStatus = "SUCCESS";
  await payment.save();

  const updatedStudentFee = await studentFeeRepository.updatePaymentStatus(
    payment.studentFeeId,
    {
      paidAmount: newPaidAmount,
      dueAmount: newDueAmount,
      status: newStatus,
    },
  );

  return {
    alreadyProcessed: false,
    payment,
    studentFee: updatedStudentFee,
  };
};
