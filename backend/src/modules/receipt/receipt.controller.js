import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import {
  generateReceiptPdfService,
  getReceiptByIdService,
  getReceiptByPaymentIdService,
  getReceiptByReceiptNumberService,
} from "./receipt.service.js";

export const getReceiptByIdController = asyncHandler(async (req, res) => {
  const receipt = await getReceiptByIdService(req.params.id, req.user);

  return successResponse({
    res,
    statusCode: 200,
    message: "Receipt fetched successfully",
    data: receipt,
  });
});

export const getReceiptByPaymentIdController = asyncHandler(
  async (req, res) => {
    const receipt = await getReceiptByPaymentIdService(
      req.params.paymentId,
      req.user,
    );

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
      req.user,
    );

    return successResponse({
      res,
      statusCode: 200,
      message: "Receipt fetched successfully",
      data: receipt,
    });
  },
);

export const getReceiptPdfController = asyncHandler(async (req, res) => {
  const pdf = await generateReceiptPdfService(req.params.id, req.user);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `inline; filename="receipt-${req.params.id}.pdf"`,
  );

  pdf.pipe(res);
});
