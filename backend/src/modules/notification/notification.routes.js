import express from "express";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import { triggerFeeReminders } from "./notification.controller.js";

const router = express.Router();
router.post(
  "/reminders/trigger",
  authenticate,
  authorize("ADMIN"),
  triggerFeeReminders,
);


export default router;
