import bcrypt from "bcryptjs";

import { createUser, findUserByEmail } from "./user.repository.js";
import AppError from "../../shared/utils/error/AppError.js";

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("User with this email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await createUser({
    name,
    email,
    password: hashedPassword,
    role: "STUDENT",
  });

  return user;
};
