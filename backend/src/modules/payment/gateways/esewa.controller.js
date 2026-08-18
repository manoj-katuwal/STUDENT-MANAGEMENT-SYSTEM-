import asyncHandler from "../../../shared/utils/asyncHandler.js";
import AppError from "../../../shared/utils/error/AppError.js";
import { successResponse } from "../../../shared/utils/response/apiResponse.js";
import { initiateOnlinePaymentService } from "./esewa.service.js";

export const initiateOnlinePaymentController = asyncHandler(
  async (req, res) => {
    const { studentFeeId, amount, gateway } = req.body;

    if (!studentFeeId || !amount || !gateway) {
      throw new AppError("studentFeeId, amount, and gateway are required", 400);
    }

    const result = await initiateOnlinePaymentService({
      studentFeeId,
      amount,
      gateway,
    });

    return successResponse({
      res,
      statusCode: 200,
      message: "Payment initiated successfully",
      data: result,
    });
  },
);

export const verifyOnlinePaymentController = asyncHandler(async (req, res) => {
  const { data } = req.query;

  if (!data) {
    throw new AppError("Missing payment verification data", 400);
  }

  const result = await verifyOnlinePaymentService(data);

  return successResponse({
    res,
    statusCode: 200,
    message: result.alreadyProcessed
      ? "Payment already processed"
      : "Payment verified successfully",
    data: result,
  });
});
