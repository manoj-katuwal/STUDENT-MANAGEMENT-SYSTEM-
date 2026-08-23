import express from "express";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";
import { createInstallmentPlan, getInstallmentPlanById } from "./installmentPlan.controller.js";
import { createInstallmentPlanSchema } from "./installmentPlan.validation.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  validate(createInstallmentPlanSchema),
  createInstallmentPlan,
);

router.get('/:id', authenticate, authorize('ADMIN', 'ACCOUNTANT'), getInstallmentPlanById);

export default router;
