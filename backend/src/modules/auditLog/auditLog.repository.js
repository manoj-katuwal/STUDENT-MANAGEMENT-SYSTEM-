import AuditLog from "./auditLog.model.js";

export const findLogsByEntity = async (entityType, entityId) => {
  return await AuditLog.find({ entityType, entityId })
    .sort({ createdAt: -1 })
    .populate("performedBy", "name email role");
};

export const findAllLogs = async (filters, page, limit) => {
  const query = {};
  if (filters.entityType) query.entityType = filters.entityType;
  if (filters.performedBy) query.performedBy = filters.performedBy;
  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) query.createdAt.$gte = new Date(filters.startDate);
    if (filters.endDate) query.createdAt.$lte = new Date(filters.endDate);
  }

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("performedBy", "name email role"),
    AuditLog.countDocuments(query),
  ]);

  return { logs, total };
};
