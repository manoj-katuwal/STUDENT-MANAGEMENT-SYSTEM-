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
    // headers already sent भइसकेको हुनसक्छ, त्यसैले सामान्य JSON error response
    // पठाउनुअघि जाँच्नुपर्छ
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: "Export failed" });
    } else {
      res.end(); // connection लाई cleanly बन्द गर्ने, hang नहोस्
    }
  }
};
