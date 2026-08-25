import asyncHandler from "../../../../shared/utils/asyncHandler.js";
import { successResponse } from "../../../../shared/utils/response/apiResponse.js";
import {
  handleEsewaFailureService,
  handleEsewaSuccessService,
  initiateEsewaPaymentService,
} from "./esewa.service.js";

export const initiateEsewaPaymentController = asyncHandler(async (req, res) => {
  const result = await initiateEsewaPaymentService(req.body, req.user.id);

  return successResponse({
    res,
    statusCode: 201,
    message: "eSewa payment initiated successfully",
    data: result,
  });
});

export const esewaSuccessController = asyncHandler(async (req, res) => {
  const result = await handleEsewaSuccessService(req.query.data);

  return successResponse({
    res,
    statusCode: 200,
    message: "eSewa payment processed successfully",
    data: result,
  });
});

export const esewaFailureController = asyncHandler(async (req, res) => {
  const result = await handleEsewaFailureService(req.query);

  return successResponse({
    res,
    statusCode: 200,
    message: "eSewa payment failed",
    data: result,
  });
});
