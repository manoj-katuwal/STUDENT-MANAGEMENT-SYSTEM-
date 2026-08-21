import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { applyDiscountService } from "./discount.service.js";

export const applyDiscount = asyncHandler(async (req, res) => {
  const { studentFeeId, type, value, reason } = req.body;
  const appliedBy = req.user.id;

  const result = await applyDiscountService({
    studentFeeId,
    type,
    value,
    reason,
    appliedBy,
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "Discount applied successfully",
    data: result,
  });
});
