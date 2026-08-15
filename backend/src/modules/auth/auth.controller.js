import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { register } from "./auth.service.js";

export const registerController = asyncHandler(async (req, res ) => {
    const user = await register(req.body);

    return successResponse({
      res,
      statusCode: 201,
      message: "User registered successfully",
      data: user,
    });
})