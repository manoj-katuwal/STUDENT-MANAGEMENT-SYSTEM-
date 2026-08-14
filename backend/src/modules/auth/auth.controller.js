import * as authService from "./auth.service.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.loginUser(email, password);

  return successResponse({
    res,
    statusCode: 200,
    message: "Login successful",
    data: result,
  });
});

export const adminTest = asyncHandler(async (req, res) => {
  return successResponse({
    res,
    statusCode: 200,
    message: "Admin access granted",
    data: {
      userId: req.user.sub,
      role: req.user.role,
    },
  });
});
