import express from "express";
import { createStudentFeeController, getStudentFeeByIdController } from "./studentFee.controller.js";
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

export default router;
