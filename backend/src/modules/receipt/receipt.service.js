import AppError from "../../shared/utils/error/AppError.js";
import {
  createReceipt,
  findReceiptById,
  findReceiptByPaymentId,
  findReceiptByReceiptNumber,
} from "./receipt.repository.js";
import { findStudentFeeById } from "../studentFee/studentFee.repository.js";
import { findStudentById, findStudentByUserId } from "../students/student.repository.js";
import PDFDocument from "pdfkit";

const ensureReceiptAccess = async (receipt, user) => {
  if (user.role !== "STUDENT") {
    return receipt;
  }

  const student = await findStudentByUserId(user.id);

  if (!student) {
    throw new AppError("Student profile not found", 403);
  }

  const studentFee = await findStudentFeeById(receipt.studentFeeId);

  if (!studentFee || String(studentFee.studentId) !== String(student._id)) {
    throw new AppError("You are not authorized to access this receipt", 403);
  }

  return receipt;
};

export const createReceiptService = async (
  {
    paymentId,
    studentFeeId,
    amount,
    paymentMethod,
    paymentType,
    paidAt,
    receiptNumber,
  },
  options = {},
) => {
  if (!paymentId) {
    throw new AppError("Payment ID is required", 400);
  }

  if (!studentFeeId) {
    throw new AppError("Student fee ID is required", 400);
  }

  if (!amount || amount <= 0) {
    throw new AppError("Valid receipt amount is required", 400);
  }

  if (!paymentMethod) {
    throw new AppError("Payment method is required", 400);
  }

  if (!paymentType) {
    throw new AppError("Payment type is required", 400);
  }

  if (!paidAt) {
    throw new AppError("Payment date is required", 400);
  }

  // Prevent duplicate receipt for the same payment
  const existingReceipt = await findReceiptByPaymentId(paymentId, options);

  if (existingReceipt) {
    return existingReceipt;
  }

  if (!receiptNumber) {
    throw new AppError("Receipt number is required", 400);
  }

  return await createReceipt(
    {
      paymentId,
      studentFeeId,
      receiptNumber,
      amount,
      paymentMethod,
      paymentType,
      paidAt,
    },
    options,
  );
};

export const getReceiptByIdService = async (receiptId, user) => {
  const receipt = await findReceiptById(receiptId);

  if (!receipt) {
    throw new AppError("Receipt not found", 404);
  }

  return await ensureReceiptAccess(receipt, user);
};

export const getReceiptByPaymentIdService = async (paymentId, user) => {
  const receipt = await findReceiptByPaymentId(paymentId);

  if (!receipt) {
    throw new AppError("Receipt not found for this payment", 404);
  }

  return await ensureReceiptAccess(receipt, user);
};

export const getReceiptByReceiptNumberService = async (receiptNumber, user) => {
  const receipt = await findReceiptByReceiptNumber(receiptNumber);

  if (!receipt) {
    throw new AppError("Receipt not found", 404);
  }

  return await ensureReceiptAccess(receipt, user);
};

export const getReceiptPdfDataService = async (receiptId) => {
  const receipt = await findReceiptById(receiptId);

  if (!receipt) {
    throw new AppError("Receipt not found", 404);
  }

  const studentFee = await findStudentFeeById(receipt.studentFeeId);

  if (!studentFee) {
    throw new AppError("Student fee not found", 404);
  }

  const student = await findStudentById(studentFee.studentId);

  if (!student) {
    throw new AppError("Student not found", 404);
  }

  return {
    receipt,
    studentFee,
    student
  };
};

export const generateReceiptPdfService = async (receiptId) => {
  const { receipt, studentFee, student } =
    await getReceiptPdfDataService(receiptId);

  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
  });

  doc.fontSize(20).text("STUDENT FEE MANAGEMENT SYSTEM", {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(14).text("PAYMENT RECEIPT", {
    align: "center",
  });

  doc.moveDown(2);

  doc.fontSize(11);

  doc.text(`Receipt Number: ${receipt.receiptNumber}`);
  doc.text(`Student Name: ${student.name}`);
  doc.text(`Admission Number: ${student.admissionNumber}`);

  doc.moveDown();

  doc.text(`Amount: Rs. ${receipt.amount}`);
  doc.text(`Payment Method: ${receipt.paymentMethod}`);
  doc.text(`Payment Type: ${receipt.paymentType}`);
  doc.text(`Paid Date: ${receipt.paidAt.toLocaleDateString()}`);

  doc.moveDown();

  doc.text(`Total Fee: Rs. ${studentFee.totalAmount}`);
  doc.text(`Discount: Rs. ${studentFee.discountAmount}`);
  doc.text(`Net Amount: Rs. ${studentFee.netAmount}`);
  doc.text(`Paid Amount: Rs. ${studentFee.paidAmount}`);
  doc.text(`Due Amount: Rs. ${studentFee.dueAmount}`);

  doc.moveDown(2);

  doc.fontSize(14).text("PAID", {
    align: "center",
  });

  doc.end();

  return doc;
};

