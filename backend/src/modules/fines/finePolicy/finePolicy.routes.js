import express from "express"
import authenticate from "../../../middleware/authenticate.js";
import authorize from "../../../middleware/authorize.js";
import validate from "../../../middleware/validate.js";
import { createFinePolicySchema } from "./finePolicy.validation.js";
import { createFinePolicyController } from "./finePolicy.controller.js";


const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  validate(createFinePolicySchema),
  createFinePolicyController,
);



export default router;