import cron from "node-cron";
import { checkAndSendFeeReminders } from "../modules/notification/notification.service.js";
import logger from "../config/logger.js";

cron.schedule("0 8 * * *", async () => {
  logger.info("Running scheduled fee reminder check...");
  try {
    const result = await checkAndSendFeeReminders();
    logger.info("Fee reminder check completed", result);
  } catch (err) {
    logger.error("Fee reminder cron job failed", { err });
  }
});
