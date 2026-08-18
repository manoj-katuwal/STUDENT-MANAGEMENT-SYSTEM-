import express from "express";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import {
  createOfflinePaymentController,
  getPaymentByIdController,
  getStudentFeePaymentHistoryController,
  getPaymentsListController,
} from "./payment.controller.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  getPaymentsListController,
);

router.post(
  "/offline",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  createOfflinePaymentController,
);

router.get(
  "/student-fee/:studentFeeId",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  getStudentFeePaymentHistoryController,
);

router.get(
  "/:paymentId",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  getPaymentByIdController,
);

export default router;
