import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";

import {
  createSectionService,
  getSectionByIdService,
  getSectionsService,
  updateSectionService,
  updateSectionStatusService,
} from "./section.service.js";

export const createSectionController = asyncHandler(async (req, res) => {
  const section = await createSectionService(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "Section created successfully",
    data: section,
  });
});

export const getSectionsController = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search?.trim() || "";
  const classId = req.query.classId?.trim() || "";

  const result = await getSectionsService(page, limit, search, classId);

  return successResponse({
    res,
    statusCode: 200,
    message: "Sections fetched successfully",
    data: result,
  });
});

export const getSectionByIdController = asyncHandler(async (req, res) => {
  const section = await getSectionByIdService(req.params.id);

  return successResponse({
    res,
    statusCode: 200,
    message: "Section fetched successfully",
    data: section,
  });
});

export const updateSectionController = asyncHandler(async (req, res) => {
  const section = await updateSectionService(req.params.id, req.body);

  return successResponse({
    res,
    statusCode: 200,
    message: "Section updated successfully",
    data: section,
  });
});

export const updateSectionStatusController = asyncHandler(async (req, res) => {
  const section = await updateSectionStatusService(
    req.params.id,
    req.body.status,
  );

  return successResponse({
    res,
    statusCode: 200,
    message: `Section ${
      section.status === "ACTIVE" ? "activated" : "deactivated"
    } successfully`,
    data: section,
  });
});
