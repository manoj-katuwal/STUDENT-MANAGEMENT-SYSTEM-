import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import {
  getMonthlyCollectionService,
  getOverdueFeeTotalService,
  getPendingFeeTotalService,
  getStudentDueListService,
  getTodayCollectionService,
} from "./reports.service.js";

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

export const getPendingFeeTotal = asyncHandler(async (req, res) => {
  const data = await getPendingFeeTotalService();

  return successResponse({
    res,
    statusCode: 200,
    message: "Pending fee total fetched successfully",
    data,
  });
});

export const getOverdueFeeTotal = asyncHandler(async (req, res) => {
  const data = await getOverdueFeeTotalService();

  return successResponse({
    res,
    statusCode: 200,
    message: "Overdue fee total fetched successfully",
    data,
  });
});

export const getStudentDueList = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const data = await getStudentDueListService({
    page,
    limit,
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Student due list fetched successfully",
    data,
  });
});
