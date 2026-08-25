// src/modules/export/export.controller.js
import { streamFeeCollectionExcel } from "./export.service.js";
import logger from "../../utils/logger.js";

export const exportFeeCollection = async (req, res) => {
  const { classId, academicYearId, status, startDate, endDate } = req.query;

  try {
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
