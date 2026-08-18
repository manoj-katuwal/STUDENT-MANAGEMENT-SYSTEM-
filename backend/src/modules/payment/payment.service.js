import AppError from "../../shared/utils/error/AppError.js";
import { findStudentFeeById, updateStudentFee } from "../studentFee/studentFee.repository.js";
import { countPayments, createPayment, findPaymentByTransactionId, findPayments, findPaymentsByStudentFeeId } from "./payment.repository.js";

export const createOfflinePaymentService = async (paymentData) => {
  const { studentFeeId, amount, paymentMethod, transactionId, remarks } =
    paymentData;

  // 1. Required fields
  if (!studentFeeId) {
    throw new AppError("Student fee is required", 400);
  }

  if (!amount) {
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

  // 5. Validate amount
  if (amount <= 0) {
    throw new AppError("Payment amount must be greater than zero", 400);
  }

  // 6. Prevent overpayment
  if (amount > studentFee.dueAmount) {
    throw new AppError(
      "Payment amount cannot be greater than the due amount",
      400,
    );
  }

  // 7. Transaction ID validation
  if (transactionId) {
    const existingPayment = await findPaymentByTransactionId(transactionId);

    if (existingPayment) {
      throw new AppError("Transaction ID already exists", 409);
    }
  }

  // 8. Calculate new financial values
  const newPaidAmount = studentFee.paidAmount + amount;

  const newDueAmount = studentFee.netAmount - newPaidAmount;

  let newStatus = "PARTIAL";

  if (newDueAmount === 0) {
    newStatus = "PAID";
  }

  // 9. Create payment
  const payment = await createPayment({
    studentFeeId,
    amount,
    paymentMethod,
    paymentType: "OFFLINE",
    paymentStatus: "SUCCESS",
    transactionId: transactionId || null,
    gateway: null,
    paidAt: new Date(),
    remarks: remarks || null,
  });

  // 10. Update StudentFee
  await updateStudentFee(studentFeeId, {
    paidAmount: newPaidAmount,
    dueAmount: newDueAmount,
    status: newStatus,
  });

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


export const getPaymentsListService = async (queryParams) => {
  const {
    page = 1,
    limit = 10,
    method,
    studentFeeId,
    fromDate,
    toDate,
  } = queryParams;

  const filter = {};

  if (method) {
    filter.method = method;
  }

  if (studentFeeId) {
    filter.studentFeeId = studentFeeId;
  }

  if (fromDate || toDate) {
    filter.createdAt = {};

    if (fromDate) {
      filter.createdAt.$gte = new Date(fromDate);
    }

    if (toDate) {
      filter.createdAt.$lte = new Date(toDate);
    }
  }

  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const skip = (pageNumber - 1) * limitNumber;

  const [payments, total] = await Promise.all([
    findPayments({ filter, skip, limit: limitNumber }),
    countPayments(filter),
  ]);

  return {
    payments,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};
