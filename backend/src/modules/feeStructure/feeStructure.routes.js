import express from "express";

import { createFeeStructureController } from "./feeStructure.controller.js";

import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createFeeStructureController,
);

export default router;
