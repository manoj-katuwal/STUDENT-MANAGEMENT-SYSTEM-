import express from "express";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import {
  createOfflinePaymentController,
  getMyPaymentsController,
  getPaymentByIdController,
  getStudentFeePaymentHistoryController,
  getPaymentsController,
  getPaymentsCsvController,
  getPaymentStatsController,
} from "./payment.controller.js";
import {
  esewaFailureController,
  esewaSuccessController,
  initiateEsewaPaymentController,
} from "./gateways/esewa/esewa.controller.js";
import validate from "../../middleware/validate.js";
import { reversePaymentSchema } from "../paymentReversal/paymentReversal.validation.js";
import { reversePayment } from "../paymentReversal/paymentReversal.controller.js";

const router = express.Router();

// --- Offline Payment Recording (Admin & Accountant only) ---
router.post(
  "/offline",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  createOfflinePaymentController,
);

// --- Student Payment History by StudentFee (Ownership checked in service for Student) ---
router.get(
  "/student-fee/:studentFeeId",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "STUDENT"),
  getStudentFeePaymentHistoryController,
);

// --- Student Personal Payment List ---
router.get(
  "/my-payments",
  authenticate,
  authorize("STUDENT"),
  getMyPaymentsController,
);

// --- Administrative Statistics and Exports ---
router.get(
  "/stats",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  getPaymentStatsController,
);

router.get(
  "/export/csv",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  getPaymentsCsvController,
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  getPaymentsController,
);

// --- Online Payment Gateway: eSewa ---
router.post(
  "/online/esewa/initiate",
  authenticate,
  authorize("STUDENT"),
  initiateEsewaPaymentController,
);

router.get("/online/esewa/success", esewaSuccessController);
router.get("/online/esewa/failure", esewaFailureController);

// --- Single Payment Lookup (Ownership checked in service for Student) ---
router.get(
  "/:paymentId",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "STUDENT"),
  getPaymentByIdController,
);

// --- Payment Reversals (Admin & Accountant only) ---
router.post(
  "/:id/reverse",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  validate(reversePaymentSchema),
  reversePayment,
);

export default router;
