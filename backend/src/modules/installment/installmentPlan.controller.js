import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import {
  cancelInstallmentPlanService,
  createInstallmentPlanService,
  getInstallmentPlanByIdService,
  listInstallmentPlansByStudentService,
} from "./installmentPlan.service.js";

export const createInstallmentPlan = asyncHandler(async (req, res) => {
  const plan = await createInstallmentPlanService(req.body, req.user.id);

  return successResponse({
    res,
    statusCode: 201,
    message: "Installment plan सफलतापूर्वक सिर्जना भयो",
    data: plan,
  });
});

export const getInstallmentPlanById = asyncHandler(async (req, res) => {
  const plan = await getInstallmentPlanByIdService(req.params.id);

  return successResponse({
    res,
    statusCode: 200,
    message: "Installment plan retrieved successfully",
    data: plan,
  });
});

export const listInstallmentPlansByStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.query;
  const { plans, total, page, limit } =
    await listInstallmentPlansByStudentService(studentId, req.query);
  return successResponse({
    res,
    statusCode: 200,
    message: "Student installment plans retrieved successfully",
    data: plans,
    meta: {
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

export const cancelInstallmentPlan = asyncHandler(async(req, res ) => {
    const plan = await cancelInstallmentPlanService(req.params.id);
    return successResponse({
      res,
      statusCode: 200,
      message: "Installment plan cancelled successfully",
      data: plan,
    }); 

})
