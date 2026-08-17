import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { createFeeStructureService } from "./feeStructure.service.js";


export const createFeeStructureController = asyncHandler(async (req, res) => {
  const feeStructure = await createFeeStructureService(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "Fee structure created successfully",
    data: feeStructure,
  });
});
