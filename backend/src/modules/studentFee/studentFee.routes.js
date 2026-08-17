import express from "express";
import {
  createStudentFeeController,
  getStudentFeeByIdController,
  getStudentFeesController,
} from "./studentFee.controller.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";

const router = express.Router();

router.post("/", authenticate, authorize("ADMIN"), createStudentFeeController);
router.get(
  "/:studentFeeId",
  authenticate,
  authorize("ADMIN"),
  getStudentFeeByIdController,
);
router.get("/", authenticate, authorize("ADMIN"), getStudentFeesController);

export default router;
