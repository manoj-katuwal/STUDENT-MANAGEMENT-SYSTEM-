import express from "express";

import {
    activateFeeStructureController,
  createFeeStructureController,
  deactivateFeeStructureController,
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
router.patch(
  "/:feeStructureId/deactivate",
  authenticate,
  authorize("ADMIN"),
  deactivateFeeStructureController,
);

router.patch(
  "/:feeStructureId/activate",
  authenticate,
  authorize("ADMIN"),
  activateFeeStructureController,
);

export default router;
