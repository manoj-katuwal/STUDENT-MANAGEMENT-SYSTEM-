import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { createStudentService } from "./student.service.js";

export const createStudentController = asyncHandler(async (req, res) => {
  const student = await createStudentService(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "Student created successfully",
    data: student,
  });
});
