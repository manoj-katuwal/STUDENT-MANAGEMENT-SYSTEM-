import asyncHandler from "../../../shared/utils/asyncHandler.js";
import { successResponse } from "../../../shared/utils/response/apiResponse.js";
import { createFinePolicyService } from "./finePolicy.service.js";



export const createFinePolicyController = asyncHandler(async (req, res) => {
  const {
    name,
    type,
    amount,
    gracePeriodDays,
    maxFineAmount,
    applicableFeeTypes,
    academicYearId,
  } = req.body;

  const createdBy = req.user.id;

  const policy = await createFinePolicyService({
    name,
    type,
    amount,
    gracePeriodDays,
    maxFineAmount,
    applicableFeeTypes,
    academicYearId,
    createdBy,
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "Fine policy created successfully",
    data: policy,
  });
});
