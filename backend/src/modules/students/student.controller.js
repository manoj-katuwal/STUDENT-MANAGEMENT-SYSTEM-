import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import {
  createStudentService,
  getStudentByIdService,
  getStudentsService,
  updateStudentService,
  updateStudentStatusService,
} from "./student.service.js";

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

export const updateStudentController = asyncHandler(async (req, res) => {
  const student = await updateStudentService(req.params.id, req.body);

  return successResponse({
    res,
    statusCode: 200,
    message: "Student updated successfully",
    data: student,
  });
});

export const updateStudentStatusController = asyncHandler(async (req, res) => {
  const student = await updateStudentStatusService(
    req.params.id,
    req.body.status,
  );

  return successResponse({
    res,
    statusCode: 200,
    message: "Student status updated successfully",
    data: student,
  });
});