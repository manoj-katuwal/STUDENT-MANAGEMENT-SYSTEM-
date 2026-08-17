import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { createStudentFeeService } from "./studentFee.service.js";


export const createStudentFeeController = asyncHandler(async (req, res) => {
  const studentFee = await createStudentFeeService(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "Student fee assigned successfully",
    data: studentFee,
  });
});
