import express from "express";
import { triggerFineCalculation } from "./fine.controller.js";
import authorize from "../../middleware/authorize.js";
import authenticate from "../../middleware/authenticate.js"


const router = express.Router();

router.post(
  "/calculate",
  authenticate,
  authorize("ADMIN"),
  triggerFineCalculation,
);





export default router;