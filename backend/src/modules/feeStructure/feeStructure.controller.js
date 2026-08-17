import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { createFeeStructureService, getFeeStructuresService } from "./feeStructure.service.js";

export const createFeeStructureController = asyncHandler(async (req, res) => {
  const feeStructure = await createFeeStructureService(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "Fee structure created successfully",
    data: feeStructure,
  });
});

export const getFeeStructuresController = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const academicYearId = req.query.academicYearId?.trim() || "";

  const classId = req.query.classId?.trim() || "";

  const feeType = req.query.feeType?.trim() || "";

  const status = req.query.status?.trim() || "";

  const result = await getFeeStructuresService(
    page,
    limit,
    academicYearId,
    classId,
    feeType,
    status,
  );

  return successResponse({
    res,
    statusCode: 200,
    message: "Fee structures fetched successfully",
    data: result.feeStructures,
    meta: result.pagination,
  });
});