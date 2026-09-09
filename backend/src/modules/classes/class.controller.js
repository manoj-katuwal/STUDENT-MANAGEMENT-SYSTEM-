import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import {
  createClassService,
  getClassByIdService,
  getClassesService,
  getClassStatsService,
  updateClassService,
  updateClassStatusService,
} from "./class.service.js";

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
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search?.trim() || "";
  const status = req.query.status?.trim() || "";

  const result = await getClassesService(page, limit, search, status);

  return successResponse({
    res,
    statusCode: 200,
    message: "Classes fetched successfully",
    data: result,
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

export const getClassStatsController = asyncHandler(async (req, res) => {
  const stats = await getClassStatsService();

  return successResponse({
    res,
    statusCode: 200,
    message: "Class statistics fetched successfully",
    data: stats,
  });
});