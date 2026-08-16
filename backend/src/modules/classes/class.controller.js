import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { createClassService, getClassesService } from "./class.service.js";

export const createClassController = asyncHandler(async (req, res) => {
  const classRecord = await createClassService(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "Class created successfully",
    data: classRecord,
  });
});

export const getClassesController = asyncHandler(async (req, res) => {
  const classes = await getClassesService();

  return successResponse({
    res,
    statusCode: 200,
    message: "Classes fetched successfully",
    data: classes,
  });
});
