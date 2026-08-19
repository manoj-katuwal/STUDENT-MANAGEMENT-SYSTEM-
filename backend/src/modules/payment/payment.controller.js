import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import {
  createOfflinePaymentService,
  getPaymentByIdService,
  getPaymentsService,
  getStudentFeePaymentHistoryService,
} from "./payment.service.js";


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

export const getPaymentsController = asyncHandler(async (req, res) => {
  const {
    studentFeeId,
    paymentMethod,
    paymentType,
    paymentStatus,
    gateway,
    page = 1,
    limit = 10,
  } = req.query;

  const result = await getPaymentsService({
    studentFeeId,
    paymentMethod,
    paymentType,
    paymentStatus,
    gateway,
    page: Number(page),
    limit: Number(limit),
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Payments fetched successfully",
    data: result.payments,
    meta: result.meta,
  });
});
