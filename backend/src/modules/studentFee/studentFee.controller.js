import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { cancelStudentFeeService, createStudentFeeService, getStudentFeeByIdService, getStudentFeesService, getStudentFeeSummaryService, updateStudentFeeService } from "./studentFee.service.js";


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

export const getStudentFeesController = asyncHandler(async (req, res) => {
  const result = await getStudentFeesService({
    page: req.query.page,
    limit: req.query.limit,
    studentId: req.query.studentId,
    academicYearId: req.query.academicYearId,
    feeStructureId: req.query.feeStructureId,
    status: req.query.status,
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Student fees fetched successfully",
    data: result,
  });
});

export const updateStudentFeeController = asyncHandler(async (req, res) => {
  const studentFee = await updateStudentFeeService(
    req.params.studentFeeId,
    req.body,
  );

  return successResponse({
    res,
    statusCode: 200,
    message: "Student fee updated successfully",
    data: studentFee,
  });
});

export const cancelStudentFeeController = asyncHandler(async (req, res) => {
  const studentFee = await cancelStudentFeeService(req.params.studentFeeId);

  return successResponse({
    res,
    statusCode: 200,
    message: "Student fee cancelled successfully",
    data: studentFee,
  });
});

export const getStudentFeeSummaryController = asyncHandler(async (req, res) => {
  const summary = await getStudentFeeSummaryService(req.params.studentId);

  return successResponse({
    res,
    statusCode: 200,
    message: "Student fee summary fetched successfully",
    data: summary,
  });
});
