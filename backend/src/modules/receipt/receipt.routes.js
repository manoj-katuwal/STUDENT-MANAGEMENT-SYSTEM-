import express from "express";
import {
  getReceiptByIdController,
  getReceiptByPaymentIdController,
  getReceiptByReceiptNumberController,
  getReceiptPdfController,
} from "./receipt.controller.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";

const router = express.Router();
router.get(
  "/payment/:paymentId",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL", "STUDENT"),
  getReceiptByPaymentIdController,
);

router.get(
  "/number/:receiptNumber",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL", "STUDENT"),
  getReceiptByReceiptNumberController,
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL", "STUDENT"),
  getReceiptByIdController,
);
router.get(
  "/:id/pdf",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL", "STUDENT"),
  getReceiptPdfController,
);

export default router;
