import express from "express";
import { createOfflinePayment } from "./payment.controller.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";

const router = express.Router();
router.post(
  "/offline",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  createOfflinePayment,
);

export default router;
