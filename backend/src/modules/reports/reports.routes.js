import express from "express";
import { getMonthlyCollection, getOverdueFeeTotal, getTodayCollection } from "./reports.controller.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import { getPendingFeeTotal } from "./reports.controller.js";

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
export default router;
