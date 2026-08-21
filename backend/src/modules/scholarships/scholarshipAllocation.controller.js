import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { allocateScholarshipService } from "./scholarshipAllocation.service.js";

export const allocateScholarship = asyncHandler(async (req, res) => {
  const { scholarshipId, studentFeeId, amount } = req.body;
  const allocatedBy = req.user.id;

  const result = await allocateScholarshipService({
    scholarshipId,
    studentFeeId,
    amount,
    allocatedBy,
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "Scholarship allocated successfully",
    data: result,
  });
});
