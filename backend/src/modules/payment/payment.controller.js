import asyncHandler from "../../shared/utils/asyncHandler.js";
import AppError from "../../shared/utils/error/AppError.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import * as paymentService from "./payment.service.js";

export const createOfflinePayment = asyncHandler(async (req, res) => {
  const { studentFeeId, amount, paymentMethod, remarks } = req.body;

  if (!studentFeeId || !amount || !paymentMethod) {
    throw new AppError(
      "studentFeeId, amount, and paymentMethod are required",
      400,
    );
  }

  const result = await paymentService.createOfflinePayment({
    studentFeeId,
    amount,
    paymentMethod,
    remarks,
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "Payment recorded successfully",
    data: result,
  });
});

export const getPaymentHistory = asyncHandler(async (req, res) => {
  const { studentFeeId } = req.params;

  const result = await paymentService.getPaymentHistory(studentFeeId);

  return successResponse({
    res,
    statusCode: 200,
    message: "Payment history fetched successfully",
    data: result,
  });
});

export const getReceipt = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  const receipt = await paymentService.getReceipt(paymentId);

  return successResponse({
    res,
    statusCode: 200,
    message: "Receipt fetched successfully",
    data: receipt,
  });
});
