import express from "express";

import {
  cancelStudentFeeController,
  createStudentFeeController,
  getMyStudentFeeByIdController,
  getMyStudentFeesController,
  getMyStudentFeeSummaryController,
  getStudentFeeByIdController,
  getStudentFeeLedgerSummary,
  getStudentFeesController,
  getStudentFeeSummaryController,
  updateStudentFeeController,
} from "./studentFee.controller.js";

import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";

const router = express.Router();

// --- Administrative Mutations ---
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  createStudentFeeController,
);

// --- Student Personal Routes (Static routes before /:studentFeeId) ---
router.get(
  "/my-fees",
  authenticate,
  authorize("STUDENT"),
  getMyStudentFeesController,
);

router.get(
  "/my-summary",
  authenticate,
  authorize("STUDENT"),
  getMyStudentFeeSummaryController,
);

router.get(
  "/my-fees/:studentFeeId",
  authenticate,
  authorize("STUDENT"),
  getMyStudentFeeByIdController,
);

// --- Admin / Staff Read Routes ---
router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getStudentFeesController,
);

// IMPORTANT: static summary route before /:studentFeeId param route
router.get(
  "/summary",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getStudentFeeLedgerSummary,
);

router.get(
  "/summary/:studentId",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getStudentFeeSummaryController,
);

router.get(
  "/:studentFeeId",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getStudentFeeByIdController,
);

// --- Administrative Updates & Cancellation ---
router.patch(
  "/:studentFeeId",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  updateStudentFeeController,
);

router.patch(
  "/:studentFeeId/cancel",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  cancelStudentFeeController,
);

export default router;
