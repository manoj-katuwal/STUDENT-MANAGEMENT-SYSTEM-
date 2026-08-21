import express from "express";
import authenticate from "../../middleware/authenticate.js";
import { applyDiscountSchema } from "./discount.validation.js";
import { applyDiscount } from "./discount.controller.js";
import validate from "../../middleware/validate.js";
import authorize from "../../middleware/authorize.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  validate(applyDiscountSchema),
  applyDiscount,
);

export default router;
