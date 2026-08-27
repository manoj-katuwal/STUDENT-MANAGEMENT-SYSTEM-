// src/modules/export/export.controller.js
import mongoose from "mongoose";
import { streamFeeCollectionExcel } from "./export.service.js";
import logger from "../../config/logger.js";
import AppError from "../../shared/utils/error/AppError.js";

export const exportFeeCollection = async (req, res) => {
  const { classId, academicYearId, status, startDate, endDate } = req.query;

  try {
    for (const [name, value] of Object.entries({ classId, academicYearId })) {
      if (value && !mongoose.isObjectIdOrHexString(value)) {
        throw new AppError(`${name} must be a valid id`, 400);
      }
    }

    const parsedStartDate = startDate ? new Date(startDate) : null;
    const parsedEndDate = endDate ? new Date(endDate) : null;
    if (
      (parsedStartDate && Number.isNaN(parsedStartDate.getTime())) ||
      (parsedEndDate && Number.isNaN(parsedEndDate.getTime()))
    ) {
      throw new AppError("startDate and endDate must be valid dates", 400);
    }
    if (parsedStartDate && parsedEndDate && parsedStartDate > parsedEndDate) {
      throw new AppError("startDate cannot be after endDate", 400);
    }

    await streamFeeCollectionExcel(
      { classId, academicYearId, status, startDate, endDate },
      res,
    );
  } catch (err) {
    logger.error("Fee collection export failed", { err });
    if (!res.headersSent) {
      const statusCode = err.statusCode || 500;
      const message = err.message || "Export failed";
      res.status(statusCode).json({ success: false, message });
    } else {
      res.end();
    }
  }
};
