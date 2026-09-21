import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import {
  createOfflinePaymentService,
  getMyPaymentsService,
  getPaymentByIdService,
  getPaymentsService,
  getPaymentStatsService,
  getPaymentsCsvService,
  getStudentFeePaymentHistoryService,
} from "./payment.service.js";

export const createOfflinePaymentController = asyncHandler(async (req, res) => {
  const payment = await createOfflinePaymentService(req.body, req.user.id);

  return successResponse({
    res,
    statusCode: 201,
    message: "Payment created successfully",
    data: payment,
  });
});

export const getPaymentByIdController = asyncHandler(async (req, res) => {
  const payment = await getPaymentByIdService(req.params.paymentId, req.user);

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
      req.user,
    );

    return successResponse({
      res,
      statusCode: 200,
      message: "Payment history fetched successfully",
      data: payments,
    });
  },
);

export const getMyPaymentsController = asyncHandler(async (req, res) => {
  const payments = await getMyPaymentsService(req.user.id);

  return successResponse({
    res,
    statusCode: 200,
    message: "Your payment history fetched successfully",
    data: payments,
  });
});

export const getPaymentsController = asyncHandler(async (req, res) => {
  const {
    studentFeeId,
    paymentMethod,
    paymentType,
    paymentStatus,
    gateway,
    search,
    page = 1,
    limit = 10,
  } = req.query;

  const result = await getPaymentsService({
    studentFeeId,
    paymentMethod,
    paymentType,
    paymentStatus,
    gateway,
    search,
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

export const getPaymentsCsvController = asyncHandler(async (req, res) => {
  const csv = await getPaymentsCsvService({
    paymentMethod: req.query.paymentMethod,
    paymentType: req.query.paymentType,
    paymentStatus: req.query.paymentStatus,
    gateway: req.query.gateway,
    search: req.query.search,
  });

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="payments.csv"');

  return res.status(200).send(csv);
});

export const getPaymentStatsController = asyncHandler(async (req, res) => {
  const stats = await getPaymentStatsService();

  return successResponse({
    res,
    statusCode: 200,
    message: "Payment stats fetched successfully",
    data: stats,
  });
});
