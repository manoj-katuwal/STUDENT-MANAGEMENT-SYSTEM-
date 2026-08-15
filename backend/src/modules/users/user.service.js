import bcrypt from "bcryptjs";

import {
  createUser,
  findUserByEmail,
  findUserByIdWithPassword,
  updateUserPassword,
} from "./user.repository.js";
import AppError from "../../shared/utils/error/AppError.js";

import * as refreshTokenRepostiory from "../../modules/auth/refreshToken/refreshToken.repository.js";
import { sendEmail } from "../../shared/services/email/email.service.js";
import { createEmailVerificationToken } from "../auth/emailVerification/emailVerification.service.js";

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

  const verificationToken = await createEmailVerificationToken(user._id);

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const html = `
  <h2>Verify your email</h2>

  <p>Please click the link below to verify your email address.</p>

  <a href="${verificationUrl}">
    Verify Email
  </a>

  <p>This link will expire in 30 minutes.</p>
`;
  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html,
  });
  return user;
};

export const changeUserPassword = async (
  userId,
  currentPassword,
  newPassword,
) => {
  const user = await findUserByIdWithPassword(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new AppError("Current Password is incorrect", 404);
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw new AppError(
      "New password must be different from current password",
      404,
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await updateUserPassword(userId, hashedPassword);

  await refreshTokenRepostiory.revokeAllUserRefreshTokens(userId);
};
