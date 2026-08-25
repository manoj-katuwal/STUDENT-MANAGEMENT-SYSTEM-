import AuditLog from "./auditLog.model.js";
import logger from "../../config/logger.js";
export const logActivity = async ({
  entityType,
  entityId,
  action,
  description,
  performedBy,
}) => {
  try {
    await AuditLog.create({
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
