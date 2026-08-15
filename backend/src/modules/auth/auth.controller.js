import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import { changeUserPassword } from "../users/user.service.js";
import {
  register,
  login,
  refreshAccessToken,
  logoutAllSessions,
} from "./auth.service.js";
import { resendVerificationEmail, verifyEmail } from "./emailVerification/emailVerification.service.js";

export const registerController = asyncHandler(async (req, res) => {
  const user = await register(req.body);

  return successResponse({
    res,
    statusCode: 201,
    message: "User registered successfully",
    data: user,
  });
});

export const loginController = asyncHandler(async (req, res) => {
  const { user, accessToken, refreshToken } = await login(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

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

export const refreshController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  const { accessToken, refreshToken: newRefreshToken } =
    await refreshAccessToken(refreshToken);

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Access token refreshed successfully",
    data: {
      accessToken,
    },
  });
});

export const logoutController = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  await logout(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Logout successful",
  });
});

export const changePasswordController = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  await changeUserPassword(req.user.id, currentPassword, newPassword);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Password changed successfully",
  });
});

export const logoutAllSessionsController = asyncHandler(async (req, res) => {
  await logoutAllSessions(req.user.id);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Logged out from all sessions successfully",
  });
});

export const verifyEmailController = asyncHandler(async (req, res) => {
  const { token } = req.query;

  await verifyEmail(token);

  return successResponse({
    res,
    statusCode: 200,
    message: "Email verified successfully",
  });
});

export const resendVerificationEmailController = asyncHandler(
  async (req, res) => {
    const { email } = req.body;

    await resendVerificationEmail(email);

    return successResponse({
      res,
      statusCode: 200,
      message:
        "If an account with that email exists and is not yet verified, a verification email has been sent",
    });
  },
);