import * as userService from "./user.service.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import asyncHandler from "../../shared/utils/asyncHandler.js";

export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  return successResponse({
    res,
    statusCode: 201,
    message: "User created successfully",
    data: user,
  });
});
