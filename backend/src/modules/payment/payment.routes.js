import express from "express";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import {
  createOfflinePaymentController,
  getPaymentByIdController,
  getStudentFeePaymentHistoryController,
  getPaymentsController,
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

router.get("/online/esewa/success", esewaSuccessController);
router.get("/online/esewa/failure", esewaFailureController);
router.post(
  "/:id/reverse",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  validate(reversePaymentSchema),
  reversePayment,
);
export default router;
