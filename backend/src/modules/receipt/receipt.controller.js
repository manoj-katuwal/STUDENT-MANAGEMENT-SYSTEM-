import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { getReceiptByIdService, getReceiptByPaymentIdService, getReceiptByReceiptNumberService } from "./receipt.service.js";

export const getReceiptByIdController = asyncHandler(async (req, res) => {
  const receipt = await getReceiptByIdService(req.params.id);

  return successResponse({
    res,
    statusCode: 200,
    message: "Receipt fetched successfully",
    data: receipt,
  });
});

export const getReceiptByPaymentIdController = asyncHandler(
  async (req, res) => {
    const receipt = await getReceiptByPaymentIdService(req.params.paymentId);

    return successResponse({
      res,
      statusCode: 200,
      message: "Receipt fetched successfully",
      data: receipt,
    });
  },
);

export const getReceiptByReceiptNumberController = asyncHandler(
  async (req, res) => {
    const receipt = await getReceiptByReceiptNumberService(
      req.params.receiptNumber,
    );

    return successResponse({
      res,
      statusCode: 200,
      message: "Receipt fetched successfully",
      data: receipt,
    });
  },
);
