import bcrypt from "bcrypt";

import * as userRepository from "./user.repository.js";
import AppError from "../../shared/utils/error/AppError.js";

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
    role,
  });

  return user;
};
