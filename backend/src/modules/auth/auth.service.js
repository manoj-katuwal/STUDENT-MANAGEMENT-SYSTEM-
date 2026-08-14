import bcrypt from "bcrypt";

import * as userRepository from "../users/user.repository.js";
import AppError from "../../shared/utils/error/AppError.js";
import { generateAccessToken } from "../../shared/utils/auth/token.js";
import { generateRefreshToken } from "../../shared/utils/auth/token.js";
import { sanitizeUser } from "../users/user.respone.js";




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

  const payload = {
    sub: user._id.toString(),
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

    return {
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    };

};
