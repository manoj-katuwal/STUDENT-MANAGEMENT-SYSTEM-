import express from "express";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";
import { createInstallmentPlan } from "./installmentPlan.controller.js";
import { createInstallmentPlanSchema } from "./installmentPlan.validation.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  validate(createInstallmentPlanSchema),
  createInstallmentPlan,
);

export default router;
