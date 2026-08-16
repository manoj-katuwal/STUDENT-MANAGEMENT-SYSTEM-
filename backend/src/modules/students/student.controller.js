import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { createStudentService, getStudentByIdService, getStudentsService } from "./student.service.js";

export const createStudentController = asyncHandler(async (req, res) => {
  const student = await createStudentService(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "Student created successfully",
    data: student,
  });
});

export const getStudentsController = asyncHandler(async (req, res) => {
  const students = await getStudentsService();

  return successResponse({
    res,
    statusCode: 200,
    message: "Students fetched successfully",
    data: students,
  });
});

export const getStudentByIdController = asyncHandler(async (req, res) => {
  const student = await getStudentByIdService(req.params.id);

  return successResponse({
    res,
    statusCode: 200,
    message: "Student fetched successfully",
    data: student,
  });
});