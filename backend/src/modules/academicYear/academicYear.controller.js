import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import AppError from "../../shared/utils/error/AppError.js";
import {
  activateAcademicYearService,
  createAcademicYearService,
  deactivateAcademicYearService,
  getAcademicYearByIdService,
  getAcademicYearStatsService,
  getAcademicYearsService,
  getAcademicYearsForExportService,
  updateAcademicYearService,
} from "./academicYear.service.js";

const getPositiveIntegerQueryParam = (
  value,
  defaultValue,
  fieldName,
  maximum,
) => {
  if (value === undefined) {
    return defaultValue;
  }

  const parsedValue = Number(value);

  if (
    !Number.isSafeInteger(parsedValue) ||
    parsedValue < 1 ||
    parsedValue > maximum
  ) {
    throw new AppError(
      `${fieldName} must be a whole number between 1 and ${maximum}`,
      400,
    );
  }

  return parsedValue;
};

const getAcademicYearFilterParams = (query) => {
  const search = query.search?.trim() || "";
  const status = query.status?.trim() || "";

  if (status && !["ACTIVE", "INACTIVE"].includes(status)) {
    throw new AppError("Status must be ACTIVE or INACTIVE", 400);
  }

  return { search, status };
};

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

export const getAcademicYearStatsController = asyncHandler(async (req, res) => {
  const stats = await getAcademicYearStatsService();

  return successResponse({
    res,
    statusCode: 200,
    message: "Academic year statistics fetched successfully",
    data: stats,
  });
});

export const getAcademicYearsCsvController = asyncHandler(async (req, res) => {
  const { search, status } = getAcademicYearFilterParams(req.query);
  const csv = await getAcademicYearsForExportService({
    search,
    status,
  });

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="academic-years.csv"',
  );

  return res.status(200).send(csv);
});

export const getAcademicYearsController = asyncHandler(async (req, res) => {
  const page = getPositiveIntegerQueryParam(req.query.page, 1, "Page", 100000);
  const limit = getPositiveIntegerQueryParam(req.query.limit, 10, "Limit", 100);
  const { search, status } = getAcademicYearFilterParams(req.query);

  const result = await getAcademicYearsService(page, limit, search, status);

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
