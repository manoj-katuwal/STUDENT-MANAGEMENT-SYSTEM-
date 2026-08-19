import express from "express";
import { getMonthlyCollection, getTodayCollection } from "./reports.controller.js";
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

export default router;
