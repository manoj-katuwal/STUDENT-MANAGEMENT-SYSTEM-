import AppError from "../../shared/utils/error/AppError.js";
import {
  findUserByEmailWithPassword,
  findUserById,
} from "../users/user.repository.js";
import { registerUser } from "../users/user.service.js";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../../config/jwt.js";
import {
  generateRefreshToken,
  hashToken,
} from "../../shared/utils/auth/token.js";
import RefreshToken from "./refreshToken/refreshToken.model.js";
import {
  findActiveRefreshToken,
  revokeRefreshToken,
  createRefreshToken,
} from "./refreshToken/refreshToken.repository.js";

export const register = async (userData) => {
  const user = await registerUser(userData);

  return user;
};

export const login = async ({ email, password }) => {
  const user = await findUserByEmailWithPassword(email);

  if (!user) {
    throw new AppError("Invalid Email and Password ", 400);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email and Password", 400);
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  const hashedToken = hashToken(refreshToken);

  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashedToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (rawRefreshToken) => {
  if (!rawRefreshToken) {
    throw new AppError("Refresh token is required", 401);
  }

  const tokenHash = hashToken(rawRefreshToken);

  const storedToken = await findActiveRefreshToken(tokenHash);

  if (!storedToken) {
    throw new AppError("Invalid or expired refresh token", 401);
  }

  const user = await findUserById(storedToken.userId);

  if (!user) {
    throw new AppError("User no longer exists", 401);
  }

  // Revoke old refresh token
  await revokeRefreshToken(storedToken._id);

  // Generate new refresh token
  const newRefreshToken = generateRefreshToken();

  // Hash new refresh token
  const newRefreshTokenHash = hashToken(newRefreshToken);

  // Save new refresh token
  await createRefreshToken({
    userId: user._id,
    tokenHash: newRefreshTokenHash,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  // Generate new access token
  const accessToken = generateAccessToken(user);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};

export const logout = async (rawRefreshToken) => {
  if (!rawRefreshToken) {
    return;
  }

  const tokenHash = hashToken(rawRefreshToken);

  const storedToken = await findActiveRefreshToken(tokenHash);

  if (!storedToken) {
    return;
  }

  await revokeRefreshToken(storedToken._id);
};
