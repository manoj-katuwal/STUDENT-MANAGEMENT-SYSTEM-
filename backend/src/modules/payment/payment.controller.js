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
