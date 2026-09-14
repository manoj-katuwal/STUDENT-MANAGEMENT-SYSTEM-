import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import {
    activateFeeStructureService,
  createFeeStructureService,
  deactivateFeeStructureService,
  getFeeStructureByIdService,
  getFeeStructuresForExportService,
  getFeeStructureStatsService,
  getFeeStructuresService,
  updateFeeStructureService,
} from "./feeStructure.service.js";

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
  const search = req.query.search?.trim() || "";

  const result = await getFeeStructuresService(
    page,
    limit,
    academicYearId,
    classId,
    feeType,
    status,
    search,
  );

  return successResponse({
    res,
    statusCode: 200,
    message: "Fee structures fetched successfully",
    data: result.feeStructures,
    meta: result.pagination,
  });
});

export const getFeeStructureStatsController = asyncHandler(async (req, res) => {
  const stats = await getFeeStructureStatsService();

  return successResponse({
    res,
    statusCode: 200,
    message: "Fee structure stats fetched successfully",
    data: stats,
  });
});

export const getFeeStructuresCsvController = asyncHandler(async (req, res) => {
  const csv = await getFeeStructuresForExportService({
    search: req.query.search,
    academicYearId: req.query.academicYearId,
    classId: req.query.classId,
    feeType: req.query.feeType,
    status: req.query.status,
  });

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="fee-structures.csv"',
  );

  return res.status(200).send(csv);
});

export const getFeeStructureByIdController = asyncHandler(async (req, res) => {
  const feeStructure = await getFeeStructureByIdService(
    req.params.feeStructureId,
  );

  return successResponse({
    res,
    statusCode: 200,
    message: "Fee structure fetched successfully",
    data: feeStructure,
  });
});
export const deactivateFeeStructureController = asyncHandler(
  async (req, res) => {
    const feeStructure = await deactivateFeeStructureService(
      req.params.feeStructureId,
    );

    return successResponse({
      res,
      statusCode: 200,
      message: "Fee structure deactivated successfully",
      data: feeStructure,
    });
  },
);

export const activateFeeStructureController = asyncHandler(async (req, res) => {
  const feeStructure = await activateFeeStructureService(
    req.params.feeStructureId,
  );

  return successResponse({
    res,
    statusCode: 200,
    message: "Fee structure activated successfully",
    data: feeStructure,
  });
});

export const updateFeeStructureController = asyncHandler(async (req, res) => {
  const feeStructure = await updateFeeStructureService(
    req.params.feeStructureId,
    req.body,
  );

  return successResponse({
    res,
    statusCode: 200,
    message: "Fee structure updated successfully",
    data: feeStructure,
  });
});
