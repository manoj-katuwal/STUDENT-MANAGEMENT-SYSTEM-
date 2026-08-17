import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import {
    activateAcademicYearService,
  createAcademicYearService,
  deactivateAcademicYearService,
  getAcademicYearByIdService,
  getAcademicYearsService,
  updateAcademicYearService,
} from "./academicYear.service.js";

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

export const getAcademicYearsController = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await getAcademicYearsService(page, limit);

  return successResponse({
    res,
    statusCode: 200,
    message: "Academic years fetched successfully",
    data: result.academicYears,
    meta: result.pagination,
  });
});

export const updateAcademicYearController = asyncHandler(async (req, res) => {
  const academicYear = await updateAcademicYearService(
    req.params.academicYearId,
    req.body,
  );

  return successResponse({
    res,
    statusCode: 200,
    message: "Academic year updated successfully",
    data: academicYear,
  });
});

export const deactivateAcademicYearController = asyncHandler(
  async (req, res) => {
    const academicYear = await deactivateAcademicYearService(
      req.params.academicYearId,
    );

    return successResponse({
      res,
      statusCode: 200,
      message: "Academic year deactivated successfully",
      data: academicYear,
    });
  },
);

export const activateAcademicYearController = asyncHandler(async (req, res) => {
  const academicYear = await activateAcademicYearService(
    req.params.academicYearId,
  );

  return successResponse({
    res,
    statusCode: 200,
    message: "Academic year activated successfully",
    data: academicYear,
  });
});
