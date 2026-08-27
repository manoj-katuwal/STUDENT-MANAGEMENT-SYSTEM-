import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import {
  checkAndSendFeeReminders,
  getNotificationLogsService,
} from "./notification.service.js";

export const triggerFeeReminders = asyncHandler(async (req, res) => {
  const result = await checkAndSendFeeReminders();

  return successResponse({
    res,
    statusCode: 200,
    message: "Fee reminder check completed",
    data: result,
  });
});

export const getNotificationLogsController = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const result = await getNotificationLogsService(page, limit);

  return successResponse({
    res,
    statusCode: 200,
    message: "Notification logs fetched successfully",
    data: result.logs,
    meta: result.pagination,
  });
});
