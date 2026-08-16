import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { createClassService, getClassByIdService, getClassesService } from "./class.service.js";

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

export const getClassByIdController = asyncHandler(async (req, res) => {
  const classRecord = await getClassByIdService(req.params.id);

  return successResponse({
    res,
    statusCode: 200,
    message: "Class fetched successfully",
    data: classRecord,
  });
});
