import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { createClassService, getClassByIdService, getClassesService, updateClassService, updateClassStatusService } from "./class.service.js";

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

export const updateClassController = asyncHandler(async (req, res) => {
  const classRecord = await updateClassService(req.params.id, req.body);

  return successResponse({
    res,
    statusCode: 200,
    message: "Class updated successfully",
    data: classRecord,
  });
});

export const updateClassStatusController = asyncHandler(async (req, res) => {
  const classRecord = await updateClassStatusService(
    req.params.id,
    req.body.status,
  );

  return successResponse({
    res,
    statusCode: 200,
    message: `Class ${
      classRecord.status === "ACTIVE" ? "activated" : "deactivated"
    } successfully`,
    data: classRecord,
  });
});
