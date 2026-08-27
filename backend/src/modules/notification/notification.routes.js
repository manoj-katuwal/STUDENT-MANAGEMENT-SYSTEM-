import express from "express";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import {
  getNotificationLogsController,
  triggerFeeReminders,
} from "./notification.controller.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  getNotificationLogsController,
);

router.post(
  "/reminders/trigger",
  authenticate,
  authorize("ADMIN"),
  triggerFeeReminders,
);

export default router;
