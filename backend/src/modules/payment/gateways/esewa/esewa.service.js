import crypto from "crypto";
import mongoose from "mongoose";
import { esewaConfig } from "./esewa.config.js";
import AppError from "../../../../shared/utils/error/AppError.js";
import {
  findStudentFeeById,
  updateStudentFeeWithPayment,
} from "../../../studentFee/studentFee.repository.js";
import {
  createPayment,
  findPaymentByTransactionId,
  findPendingPaymentByStudentFeeId,
} from "../../payment.repository.js";
import { generateReceiptNumber } from "../../../receipt/receiptCounter.service.js";
import { createReceiptService } from "../../../receipt/receipt.service.js";

export const generateEsewaSignature = ({ totalAmount, transactionUuid }) => {
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${esewaConfig.productCode}`;

  return crypto
    .createHmac("sha256", esewaConfig.secretKey)
    .update(message)
    .digest("base64");
};

export const createEsewaPaymentData = ({ amount, transactionUuid }) => {
  const totalAmount = Number(amount);

  const signature = generateEsewaSignature({
    totalAmount,
    transactionUuid,
  });

  return {
    amount: totalAmount,
    tax_amount: 0,
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
    product_code: esewaConfig.productCode,
    product_service_charge: 0,
    product_delivery_charge: 0,

    success_url: esewaConfig.successUrl,
    failure_url: esewaConfig.failureUrl,

    signed_field_names: "total_amount,transaction_uuid,product_code",

    signature,
  };
};

export const generateTransactionUuid = () => {
  return `TXN-${Date.now()}-${crypto
    .randomUUID()
    .replace(/-/g, "")
    .slice(0, 8)}`;
};

export const initiateEsewaPaymentService = async ({ studentFeeId, amount }) => {
  const paymentAmount = Number(amount);

  if (!studentFeeId) {
    throw new AppError("Student fee is required", 400);
  }

  if (!Number.isFinite(paymentAmount) || paymentAmount <= 0) {
    throw new AppError("Valid payment amount is required", 400);
  }

  const studentFee = await findStudentFeeById(studentFeeId);

  if (!studentFee) {
    throw new AppError("Student fee not found", 404);
  }

  if (studentFee.status === "CANCELLED") {
    throw new AppError("Cannot make payment for a cancelled student fee", 400);
  }

  if (paymentAmount > studentFee.dueAmount) {
    throw new AppError(
      "Payment amount cannot be greater than the due amount",
      400,
    );
  }

  const pendingPayment = await findPendingPaymentByStudentFeeId(
    studentFeeId,
    "ESEWA",
  );

  if (pendingPayment) {
    throw new AppError(
      "An eSewa payment is already pending for this student fee",
      409,
    );
  }

  const transactionUuid = generateTransactionUuid();

  const payment = await createPayment({
    studentFeeId,
    amount: paymentAmount,
    paymentMethod: "ESEWA",
    paymentType: "ONLINE",
    paymentStatus: "PENDING",
    transactionId: transactionUuid,
    gateway: "ESEWA",
    paidAt: null,
  });

  const paymentData = createEsewaPaymentData({
    amount: paymentAmount,
    transactionUuid,
  });

  return {
    paymentId: payment._id,
    transactionUuid,
    paymentUrl: esewaConfig.paymentUrl,
    paymentData,
  };
};
// 6. transaction commit

export const decodeEsewaResponse = (encodedData) => {
  try {
    const decoded = Buffer.from(encodedData, "base64").toString("utf-8");

    return JSON.parse(decoded);
  } catch {
    throw new AppError("Invalid eSewa response", 400);
  }
};
export const verifyEsewaResponseSignature = ({ response }) => {
  const { signed_field_names, signature } = response;

  if (!signed_field_names || !signature) {
    return false;
  }

  const message = signed_field_names
    .split(",")
    .map((field) => `${field}=${response[field]}`)
    .join(",");

  const expectedSignature = crypto
    .createHmac("sha256", esewaConfig.secretKey)
    .update(message)
    .digest("base64");

  return expectedSignature === signature;
};
export const handleEsewaSuccessService = async (encodedData) => {
  if (!encodedData) {
    throw new AppError("eSewa response data is missing", 400);
  }

  // 1. Decode eSewa response
  const response = decodeEsewaResponse(encodedData);

  // 2. Verify callback signature
  const isValidSignature = verifyEsewaResponseSignature({
    response,
  });

  if (!isValidSignature) {
    throw new AppError("Invalid eSewa response signature", 400);
  }

  const {
    status,
    transaction_code: transactionCode,
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
  } = response;

  // 3. Callback status check
  if (status !== "COMPLETE") {
    throw new AppError("eSewa payment was not completed", 400);
  }

  const session = await mongoose.startSession();

  try {
    let payment;

    await session.withTransaction(async () => {
      // 4. Find our PENDING payment
      payment = await findPaymentByTransactionId(transactionUuid, { session });

      if (!payment) {
        throw new AppError("Payment transaction not found", 404);
      }

      // 5. Verify gateway
      if (payment.gateway !== "ESEWA") {
        throw new AppError("Invalid payment gateway", 400);
      }

      // 6. Idempotency
      if (payment.paymentStatus === "SUCCESS") {
        return;
      }

      // 7. Verify amount
      if (Number(payment.amount) !== Number(totalAmount)) {
        throw new AppError("Payment amount mismatch", 400);
      }

      // 8. Server-to-server verification
      const verification = await verifyEsewaTransaction({
        transactionUuid,
        totalAmount: payment.amount,
      });

      if (verification.status !== "COMPLETE") {
        throw new AppError("eSewa transaction verification failed", 400);
      }

      // 9. Atomic StudentFee update
      const updatedStudentFee = await updateStudentFeeWithPayment(
        payment.studentFeeId,
        Number(payment.amount),
        { session },
      );

      if (!updatedStudentFee) {
        throw new AppError(
          "Payment could not be processed because the due amount has changed",
          409,
        );
      }

      updatedStudentFee.status =
        updatedStudentFee.dueAmount === 0 ? "PAID" : "PARTIAL";
      await updatedStudentFee.save({ session });

      // 10. Mark payment SUCCESS
      payment.paymentStatus = "SUCCESS";
      payment.paidAt = new Date();
      payment.gatewayTransactionId = transactionCode;

      await payment.save({ session });
      const receiptNumber = await generateReceiptNumber({ session });

      await createReceiptService(
        {
          paymentId: payment._id,
          studentFeeId: payment.studentFeeId,
          receiptNumber,
          amount: payment.amount,
          paymentMethod: payment.paymentMethod,
          paymentType: payment.paymentType,
          paidAt: payment.paidAt,
        },
        { session },
      );
    });

    return payment;
  } finally {
    await session.endSession();
  }
};

export const verifyEsewaTransaction = async ({
  transactionUuid,
  totalAmount,
}) => {
  const params = new URLSearchParams({
    product_code: esewaConfig.productCode,
    total_amount: String(totalAmount),
    transaction_uuid: transactionUuid,
  });

  const response = await fetch(
    `${esewaConfig.statusUrl}?${params.toString()}`,
    {
      method: "GET",
    },
  );

  if (!response.ok) {
    throw new AppError("Unable to verify eSewa transaction", 502);
  }

  const result = await response.json();

  return result;
};

export const handleEsewaFailureService = async (query) => {
  const { transaction_uuid: transactionUuid } = query;

  if (!transactionUuid) {
    throw new AppError("eSewa transaction UUID is missing", 400);
  }

  const session = await mongoose.startSession();

  try {
    let payment;

    await session.withTransaction(async () => {
      payment = await findPaymentByTransactionId(transactionUuid, { session });

      if (!payment) {
        throw new AppError("Payment transaction not found", 404);
      }

      if (payment.gateway !== "ESEWA") {
        throw new AppError("Invalid payment gateway", 400);
      }

      // Already processed
      if (payment.paymentStatus === "SUCCESS") {
        return;
      }

      // Already failed
      if (payment.paymentStatus === "FAILED") {
        return;
      }

      payment.paymentStatus = "FAILED";

      await payment.save({ session });
    });

    return payment;
  } finally {
    await session.endSession();
  }
};
