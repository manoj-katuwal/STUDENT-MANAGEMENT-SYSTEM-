import express from "express";
import {
  getAcademicYearCollectionSummary,
  getDashboardSummary,
  getMonthlyCollection,
  getOverdueFeeTotal,
  getPaymentMethodCollection,
  getPendingFeeTotal,
  getRecentPayments,
  getStudentDueList,
  getTodayCollection,
} from "./reports.controller.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";

const router = express.Router();

router.get(
  "/today-collection",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getTodayCollection,
);

router.get(
  "/monthly-collection",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getMonthlyCollection,
);

router.get(
  "/pending-fee-total",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getPendingFeeTotal,
);
router.get(
  "/overdue-fee-total",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getOverdueFeeTotal,
);

router.get(
  "/student-dues",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getStudentDueList,
);

router.get(
  "/payment-method-collection",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getPaymentMethodCollection,
);

router.get(
  "/recent-payments",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getRecentPayments,
);

router.get(
  "/academic-year-collection",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getAcademicYearCollectionSummary,
);

router.get(
  "/dashboard",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getDashboardSummary,
);
export default router;
