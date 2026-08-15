import AppError from "../../shared/utils/error/AppError.js";
import { findUserByEmailWithPassword } from "../users/user.repository.js";
import { registerUser } from "../users/user.service.js";
import bcrypt from "bcryptjs";
import { generateAccessToken } from "../../config/jwt.js";
import {
  generateRefreshToken,
  hashToken,
} from "../../shared/utils/auth/token.js";
import RefreshToken from "./refreshToken/refreshToken.model.js";

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
    tokenHash: refreshToken,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

 

  return {
    user,
    accessToken,
    refreshToken,
  };
};
