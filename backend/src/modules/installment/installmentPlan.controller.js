import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { createInstallmentPlanService } from "./installmentPlan.service.js";

export const createInstallmentPlan = asyncHandler(async (req, res) => {
      const plan = await createInstallmentPlanService(req.body, req.user.id);

      return successResponse({
        res,
        statusCode: 201,
        message: "Installment plan सफलतापूर्वक सिर्जना भयो",
        data : plan 
      });


})
