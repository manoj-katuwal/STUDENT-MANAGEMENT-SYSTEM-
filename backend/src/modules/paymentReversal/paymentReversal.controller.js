import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { reversePaymentService } from "./paymentReversal.service.js";

export const reversePayment = asyncHandler(async (req, res) => {
  const { id: paymentId } = req.params;
  const { reason } = req.body;

  const reversal = await reversePaymentService(paymentId, reason, req.user.id);

  return successResponse({
    res,
    statusCode: 200,
    message: "Payment retreived successfully",
    data: reversal,
  });
});
