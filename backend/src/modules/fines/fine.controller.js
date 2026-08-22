import {calculateAndApplyFinesService} from "./fine.service.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";


export const triggerFineCalculation = asyncHandler(async (req, res) => {
  const results = await calculateAndApplyFinesService();

  return successResponse({
    res,
    message: "Fine calculation completed",
    statusCode: 200,
    data: {
      processedCount: results.length,
      fines: results,
    },
  });
});
