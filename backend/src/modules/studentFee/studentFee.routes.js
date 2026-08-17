import express from "express";
import {
  createStudentFeeController,
  getStudentFeeByIdController,
  getStudentFeesController,
  updateStudentFeeController,
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
router.patch(
  "/:studentFeeId",
  authenticate,
  authorize("ADMIN"),
  updateStudentFeeController,
);

export default router;
