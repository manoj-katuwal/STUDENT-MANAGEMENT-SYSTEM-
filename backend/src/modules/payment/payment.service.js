import AppError from "../../shared/utils/error/AppError.js";
import mongoose from "mongoose";
import {
  findStudentFeeById,
  updateStudentFee,
} from "../studentFee/studentFee.repository.js";
import {
  countPayments,
  createPayment,
  findPaymentById,
  findPaymentByTransactionId,
  findPayments,
  findPaymentsByStudentFeeId,
} from "./payment.repository.js";

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

  const session = await mongoose.startSession();

  try {
    let payment;

    await session.withTransaction(async () => {
      // 3. Find StudentFee
      const studentFee = await findStudentFeeById(studentFeeId, { session });

      if (!studentFee) {
        throw new AppError("Student fee not found", 404);
      }

      // 4. Cannot pay cancelled fee
      if (studentFee.status === "CANCELLED") {
        throw new AppError(
          "Cannot make payment for a cancelled student fee",
          400,
        );
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
        const existingPayment = await findPaymentByTransactionId(transactionId, {
          session,
        });

        if (existingPayment) {
          throw new AppError("Transaction ID already exists", 409);
        }
      }

      // 8. Calculate new financial values
      const newPaidAmount = studentFee.paidAmount + amount;
      const newDueAmount = studentFee.netAmount - newPaidAmount;
      const newStatus = newDueAmount === 0 ? "PAID" : "PARTIAL";

      // 9. Create payment
      payment = await createPayment(
        {
          studentFeeId,
          amount,
          paymentMethod,
          paymentType: "OFFLINE",
          paymentStatus: "SUCCESS",
          transactionId: transactionId || null,
          gateway: null,
          paidAt: new Date(),
          remarks: remarks || null,
        },
        { session },
      );

      // 10. Update StudentFee
      await updateStudentFee(
        studentFeeId,
        {
          paidAmount: newPaidAmount,
          dueAmount: newDueAmount,
          status: newStatus,
        },
        { session },
      );
    });

    return payment;
  } finally {
    await session.endSession();
  }
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
