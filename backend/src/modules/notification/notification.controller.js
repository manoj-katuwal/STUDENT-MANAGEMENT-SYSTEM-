
import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse";
import { checkAndSendFeeReminders } from "./notification.service.js";


export const triggerFeeReminders = asyncHandler(async (req, res) => {
  await checkAndSendFeeReminders();

  return successResponse({
    res,
    statusCode: 200,
    message: "Fee reminder check completed",
  });
});
