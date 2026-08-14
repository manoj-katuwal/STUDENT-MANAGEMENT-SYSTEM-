import bcrypt from "bcrypt";

import * as userRepository from "./user.repository.js";
import AppError from "../../shared/utils/error/AppError.js";
import { sanitizeUser } from "./user.respone.js";

export const createUser = async (userData) => {
  const { name, email, password, role } = userData;

  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw new AppError("Email is already registered", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await userRepository.createUser({
    name,
    email,
    password: hashedPassword,
    role: "STUDENT"
  });

  return sanitizeUser(user);
};

export const getUserById = async (userId) => {
  const user = await userRepository.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return sanitizeUser(user);
};

export const findById = async (userId) => {
  return userRepository.findById(userId);
};
