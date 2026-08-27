import AuditLog from "./auditLog.model.js";
import {
  findAllLogs as findAllLogsRepository,
  findLogsByEntity as findLogsByEntityRepository,
} from "./auditLog.repository.js";
import logger from "../../config/logger.js";
import AppError from "../../shared/utils/error/AppError.js";

const toPositiveInteger = (value, fallback) => {
  const parsedValue = Number(value);

  return Number.isInteger(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
};

const toValidDate = (value, fieldName) => {
  if (!value) return undefined;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new AppError(`${fieldName} must be a valid date`, 400);
  }

  return date;
};
export const logActivity = async ({
  entityType,
  entityId,
  action,
  description,
  performedBy,
}) => {
  try {
    return await AuditLog.create({
      entityType,
      entityId,
      action,
      description,
      performedBy,
    });
  } catch (err) {
    logger.error("Failed to write audit log", {
      entityType,
      entityId,
      action,
      err,
    });
  }
};

export const findLogsByEntity = async (entityType, entityId) => {
  return findLogsByEntityRepository(entityType, entityId);
};

export const findAllLogs = async (filters = {}, page = 1, limit = 10) => {
  const normalizedFilters = {
    ...filters,
    startDate: toValidDate(filters.startDate, "startDate"),
    endDate: toValidDate(filters.endDate, "endDate"),
  };

  if (
    normalizedFilters.startDate &&
    normalizedFilters.endDate &&
    normalizedFilters.startDate > normalizedFilters.endDate
  ) {
    throw new AppError("startDate cannot be after endDate", 400);
  }

  return findAllLogsRepository(
    normalizedFilters,
    toPositiveInteger(page, 1),
    toPositiveInteger(limit, 10),
  );
};
