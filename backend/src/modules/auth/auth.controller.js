import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { register, login } from "./auth.service.js";

export const registerController = asyncHandler(async (req, res) => {
  const user = await register(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "User registered successfully",
    data: user,
  });
});

export const loginContoller = asyncHandler(async (req, res) => {
  const { user, accessToken } = await login(req.body);

  return successResponse({
    res,
    statusCode: 200,
    message: "Login SuccessFully",
    data: {
      user,
      accessToken,
    },
  });
});
