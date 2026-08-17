import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { createAcademicYearService, getAcademicYearByIdService } from "./academicYear.service.js";

export const createAcademicYearController = asyncHandler(async (req, res) => {
  const academicYear = await createAcademicYearService(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "Academic year created successfully",
    data: academicYear,
  });
});

export const getAcademicYearByIdController = asyncHandler(async (req, res) => {
  const academicYear = await getAcademicYearByIdService(
    req.params.academicYearId,
  );

  return successResponse({
    res,
    statusCode: 200,
    message: "Academic year fetched successfully",
    data: academicYear,
  });
});
