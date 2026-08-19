import express from "express";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import {
  createOfflinePaymentController,
  getPaymentByIdController,
  getStudentFeePaymentHistoryController,
  getPaymentsController,
} from "./payment.controller.js";
import { initiateEsewaPaymentController } from "./gateways/esewa/esewa.controller.js";

const router = express.Router();

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

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  getPaymentsController,
);

router.post(
  "/online/esewa/initiate",
  authenticate,
  authorize("STUDENT"),
  initiateEsewaPaymentController,
);
export default router;
