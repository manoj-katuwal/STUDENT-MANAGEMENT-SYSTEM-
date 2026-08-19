import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { getMonthlyCollectionService, getTodayCollectionService } from "./reports.service.js";

export const getTodayCollection = asyncHandler(async (req, res) => {
  const data = await getTodayCollectionService();

  return successResponse({
    res,
    statusCode: 200,
    message: "Today's collection fetched successfully",
    data,
  });
});

export const getMonthlyCollection = asyncHandler(async (req, res) => {
  const data = await getMonthlyCollectionService();

  return successResponse({
    res,
    statusCode: 200,
    message: "Monthly collection fetched successfully",
    data,
  });
});
