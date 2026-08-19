import crypto from "crypto";
import { esewaConfig } from "./esewa.config.js";
import AppError from "../../../../shared/utils/error/AppError.js";

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
  if (!studentFeeId) {
    throw new AppError("Student fee is required", 400);
  }

  if (!amount || amount <= 0) {
    throw new AppError("Valid payment amount is required", 400);
  }

  const studentFee = await findStudentFeeById(studentFeeId);

  if (!studentFee) {
    throw new AppError("Student fee not found", 404);
  }

  if (studentFee.status === "CANCELLED") {
    throw new AppError("Cannot make payment for a cancelled student fee", 400);
  }

  if (amount > studentFee.dueAmount) {
    throw new AppError(
      "Payment amount cannot be greater than the due amount",
      400,
    );
  }

  const transactionUuid = generateTransactionUuid();

  const payment = await createPayment({
    studentFeeId,
    amount,
    paymentMethod: "ESEWA",
    paymentType: "ONLINE",
    paymentStatus: "PENDING",
    transactionId: transactionUuid,
    gateway: "ESEWA",
    paidAt: null,
  });

  const paymentData = createEsewaPaymentData({
    amount,
    transactionUuid,
  });

  return {
    paymentId: payment._id,
    transactionUuid,
    paymentData,
  };
};