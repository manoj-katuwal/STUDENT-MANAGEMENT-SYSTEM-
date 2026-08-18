import express from "express";
import authenticate from "../../../middleware/authenticate.js";
import { initiateOnlinePaymentController, verifyOnlinePaymentController } from "./esewa.controller.js";
import authorize from "../../../middleware/authorize.js";


const router = express.Router();
router.post(
  "/online/initiate",
  authenticate,
  authorize("STUDENT"), 
  initiateOnlinePaymentController,
);

router.get("/online/verify", authenticate, verifyOnlinePaymentController);



export default router;