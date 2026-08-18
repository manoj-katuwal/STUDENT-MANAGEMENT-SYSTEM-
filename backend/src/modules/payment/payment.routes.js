import express from "express";
import { createOfflinePayment, getPaymentHistory, getReceipt } from "./payment.controller.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";

const router = express.Router();
router.post(
  "/offline",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  createOfflinePayment,
);

router.get(
  "/student-fee/:studentFeeId",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "STUDENT"),
  getPaymentHistory,
);

router.get(
  "/:paymentId/receipt",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "STUDENT"),
  getReceipt,
);

export default router;
