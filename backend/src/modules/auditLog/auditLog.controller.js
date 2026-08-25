import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { findAllLogs, findLogsByEntity } from "./auditLog.service.js";

const toPositiveInteger = (value, fallback) => {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
};

export const getEntityLogs = asyncHandler(async (req, res) => {
  const { entityType, entityId } = req.params;
  const logs = await findLogsByEntity(entityType, entityId);

  return successResponse({
    res,
    statusCode: 200,
    message: "Audit logs fetched successfully",
    data: logs,
  });
});

export const getAllLogs = asyncHandler(async (req, res) => {
  const {
    entityType,
    performedBy,
    startDate,
    endDate,
  } = req.query;
  const page = toPositiveInteger(req.query.page, 1);
  const limit = toPositiveInteger(req.query.limit, 20);

  const { logs, total } = await findAllLogs(
    { entityType, performedBy, startDate, endDate },
    page,
    limit,
  );

  const totalPages = Math.ceil(total / limit);

  return successResponse({
    res,
    statusCode: 200,
    message: "Audit logs fetched successfully",
    data: logs,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  });
});
