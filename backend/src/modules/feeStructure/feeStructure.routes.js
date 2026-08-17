import express from "express";

import {
  createFeeStructureController,
  getFeeStructureByIdController,
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
router.get(
  "/:feeStructureId",
  authenticate,
  authorize("ADMIN"),
  getFeeStructureByIdController,
);

export default router;
