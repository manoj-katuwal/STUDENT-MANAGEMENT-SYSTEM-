import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { awardScholarshipService } from "./scholarship.service.js";

export const awardScholarship = asyncHandler(async (req, res) => {
  const {
    studentId,
    academicYearId,
    name,
    type,
    valueType,
    value,
    sponsor,
    startDate,
    endDate,
  } = req.body;

  const createdBy = req.user.id;

  const scholarship = await awardScholarshipService({
    studentId,
    academicYearId,
    name,
    type,
    valueType,
    value,
    sponsor,
    startDate,
    endDate,
    createdBy,
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "Scholarship awarded successfully",
    data: scholarship,
  });
});
