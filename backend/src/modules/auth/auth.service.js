import bcrypt from "bcrypt";

import * as userRepository from "../users/user.repository.js";
import AppError from "../../shared/utils/error/AppError.js";
const payload = {
  sub: user._id.toString(),
  role: user.role,
};

const accessToken = generateAccessToken(payload);
const refreshToken = generateRefreshToken(payload);

export const loginUser = async (email, password) => {
  const user = await userRepository.findByEmailWithPassword(email);

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isActive) {
    throw new AppError("Account is inactive", 403);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  return user;
};
