import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";

import { createSectionService } from "./section.service.js";

export const createSectionController = asyncHandler(async (req, res) => {
  const section = await createSectionService(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "Section created successfully",
    data: section,
  });
});
