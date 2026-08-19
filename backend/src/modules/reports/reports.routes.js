import express from "express";
import { getTodayCollection } from "./reports.controller.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";

const router = express.Router();

router.get(
  "/today-collection",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getTodayCollection,
);

export default router;
