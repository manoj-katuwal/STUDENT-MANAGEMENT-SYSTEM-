import express from "express";

import {
  createFeeStructureController,
  getFeeStructuresController,
} from "./feeStructure.controller.js";

import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createFeeStructureController,
);

router.get("/", authenticate, authorize("ADMIN"), getFeeStructuresController);

export default router;
