import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { createOfflinePaymentService, getPaymentsListService, getStudentFeePaymentHistoryService } from "./payment.service.js";


export const createOfflinePaymentController = asyncHandler(async (req, res) => {
  const payment = await createOfflinePaymentService(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "Payment created successfully",
    data: payment,
  });
});

export const getPaymentByIdController = asyncHandler(async (req, res) => {
  const payment = await getPaymentByIdService(req.params.paymentId);

  return successResponse({
    res,
    statusCode: 200,
    message: "Payment fetched successfully",
    data: payment,
  });
});

export const getStudentFeePaymentHistoryController = asyncHandler(
  async (req, res) => {
    const payments = await getStudentFeePaymentHistoryService(
      req.params.studentFeeId,
    );

    return successResponse({
      res,
      statusCode: 200,
      message: "Payment history fetched successfully",
      data: payments,
    });
  },
);

export const getPaymentsListController = asyncHandler(async (req, res) => {
  const result = await getPaymentsListService(req.query);

  return successResponse({
    res,
    statusCode: 200,
    message: "Payments fetched successfully",
    data: result,
  });
});
