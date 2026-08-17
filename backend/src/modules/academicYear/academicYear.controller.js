import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { createAcademicYearService } from "./academicYear.service.js";

export const createAcademicYearController = asyncHandler(async (req, res) => {
  const academicYear = await createAcademicYearService(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "Academic year created successfully",
    data: academicYear,
  });
});
