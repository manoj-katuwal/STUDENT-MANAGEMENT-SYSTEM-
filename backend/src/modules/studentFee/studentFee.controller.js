import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { createStudentFeeService, getStudentFeeByIdService } from "./studentFee.service.js";


export const createStudentFeeController = asyncHandler(async (req, res) => {
  const studentFee = await createStudentFeeService(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "Student fee assigned successfully",
    data: studentFee,
  });
});

export const getStudentFeeByIdController = asyncHandler(async (req, res) => {
  const studentFee = await getStudentFeeByIdService(req.params.studentFeeId);

  return successResponse({
    res,
    statusCode: 200,
    message: "Student fee fetched successfully",
    data: studentFee,
  });
});
