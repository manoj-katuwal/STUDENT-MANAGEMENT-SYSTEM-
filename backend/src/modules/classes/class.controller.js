import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { createClassService } from "./class.service.js";

export const createClassController = asyncHandler(async (req, res) => {
  const classRecord = await createClassService(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "Class created successfully",
    data: classRecord,
  });
});
