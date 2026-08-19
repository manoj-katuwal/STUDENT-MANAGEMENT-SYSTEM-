import asyncHandler from "../../../../shared/utils/asyncHandler.js";
import { successResponse } from "../../../../shared/utils/response/apiResponse.js";
import { initiateEsewaPaymentService } from "./esewa.service.js";

export const initiateEsewaPaymentController = asyncHandler(async (req, res) => {
  const result = await initiateEsewaPaymentService(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "eSewa payment initiated successfully",
    data: result,
  });
});
