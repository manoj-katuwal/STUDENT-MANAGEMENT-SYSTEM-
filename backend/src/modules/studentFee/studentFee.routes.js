import express from "express";

import {
  cancelStudentFeeController,
  createStudentFeeController,
  getStudentFeeByIdController,
  getStudentFeeLedgerSummary,
  getStudentFeesController,
  getStudentFeeSummaryController,
  updateStudentFeeController,
} from "./studentFee.controller.js";

import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  createStudentFeeController,
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getStudentFeesController,
);

// IMPORTANT: static routes before /:studentFeeId param route
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
