import AppError from "../../shared/utils/error/AppError.js";
import { findUserByEmailWithPassword } from "../users/user.repository.js";
import { registerUser } from "../users/user.service.js";
import bcrypt from "bcryptjs";

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
  return user;
};
