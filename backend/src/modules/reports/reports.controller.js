import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { getTodayCollectionService } from "./reports.service.js";


export const getTodayCollection = asyncHandler(async (req, res) => {
  const data = await getTodayCollectionService();

  return successResponse({
    res,
    statusCode: 200,
    message: "Today's collection fetched successfully",
    data,
  });
});
