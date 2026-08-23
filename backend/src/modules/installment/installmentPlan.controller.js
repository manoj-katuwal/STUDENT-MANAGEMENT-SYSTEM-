import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { createInstallmentPlanService, getInstallmentPlanByIdService } from "./installmentPlan.service.js";

export const createInstallmentPlan = asyncHandler(async (req, res) => {
  const plan = await createInstallmentPlanService(req.body, req.user.id);

  return successResponse({
    res,
    statusCode: 201,
    message: "Installment plan सफलतापूर्वक सिर्जना भयो",
    data: plan,
  });
});

export const getInstallmentPlanById = asyncHandler(async(req, res) => {
    const plan = await getInstallmentPlanByIdService(req.params.id);

    return successResponse({
      res,
      statusCode: 200,
      message: "Installment plan retrieved successfully",
      data: plan
    });

})
