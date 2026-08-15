import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";

import { registerUser } from "./user.service.js";

export const registerUserController = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const user = await registerUser({
    name,
    email,
    password,
  });

  return successResponse({
    res,
    statusCode: 201,
    message: "User registered successfully",
    data: user,
  });
});
