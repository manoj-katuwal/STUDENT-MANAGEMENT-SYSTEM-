import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";

import {
  activateUser,
  changeUserRole,
  createNewUser,
  deactivateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  registerUser,
  updateMyProfile,
} from "./user.service.js";

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

export const createUserController = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  const user = await createNewUser({ name, email, password, role });

  return successResponse({
    res,
    statusCode: 201,
    message: "User created successfully",
    data: user,
  });
});

export const getAllUsersController = asyncHandler(async (req, res) => {
  const { role, isActive, search, page = 1, limit = 10 } = req.query;

  const filters = {
    role,
    search,
    isActive:
      isActive === "true" ? true : isActive === "false" ? false : undefined,
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
  };

  const result = await getAllUsers(filters);

  return successResponse({
    res,
    statusCode: 200,
    message: "Users fetched successfully",
    data: result,
  });
});

export const getUserByIdController = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await getUserById(userId);

  return successResponse({
    res,
    statusCode: 200,
    message: "User fetched successfully",
    data: user,
  });
});

export const changeUserRoleController = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  const user = await changeUserRole(req.user.id, userId, role);

  return successResponse({
    res,
    statusCode: 200,
    message: "User role updated successfully",
    data: user,
  });
});

export const activateUserController = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await activateUser(userId);

  return successResponse({
    res,
    statusCode: 200,
    message: "User activated successfully",
    data: user,
  });
});

export const deactivateUserController = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await deactivateUser(req.user.id, userId);

  return successResponse({
    res,
    statusCode: 200,
    message: "User deactivated successfully",
    data: user,
  });
});

export const deleteUserController = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await deleteUser(req.user.id, userId);

  return successResponse({
    res,
    statusCode: 200,
    message: "User deleted successfully",
    data: user,
  });
});

export const getMyProfileController = asyncHandler(async (req, res) => {
  const user = await getUserById(req.user.id);

  return successResponse({
    res,
    statusCode: 200,
    message: "Profile fetched successfully",
    data: user,
  });
});

export const updateMyProfileController = asyncHandler(async (req, res) => {
  const user = await updateMyProfile(req.user.id, req.body);

  return successResponse({
    res,
    statusCode: 200,
    message: "Profile updated successfully",
    data: user,
  });
});
