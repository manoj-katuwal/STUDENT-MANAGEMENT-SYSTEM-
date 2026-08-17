import express from "express";
import { createStudentFeeController } from "./studentFee.controller.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";



const router = express.Router();

router.post("/", authenticate, authorize("ADMIN"), createStudentFeeController);

export default router;
