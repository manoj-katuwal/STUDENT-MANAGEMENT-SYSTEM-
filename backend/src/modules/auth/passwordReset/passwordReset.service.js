import bcrypt from "bcryptjs";
import { sendEmail } from "../../../shared/services/email/email.service.js";
import {
  generateRefreshToken,
  hashToken,
} from "../../../shared/utils/auth/token.js";
import AppError from "../../../shared/utils/error/AppError.js";
import {
  findUserByEmail,
  findUserById,
  updateUserPassword,
} from "../../users/user.repository.js";
import {
  createPasswordReset,
  deleteUnusedPasswordResetsByUserId,
  findPasswordResetByTokenHash,
  markPasswordResetAsUsed,
} from "./passwordReset.repository.js";
import { revokeAllUserRefreshTokens } from "../refreshToken/refreshToken.repository.js";

export const forgotPassword = async (email) => {
  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return;
  }

  await deleteUnusedPasswordResetsByUserId(user._id);

  const rawToken = generateRefreshToken();
  const tokenHash = hashToken(rawToken);

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await createPasswordReset({
    userId: user._id,
    tokenHash,
    expiresAt,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("🔑 DEV PASSWORD RESET TOKEN:", rawToken);
  }

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${rawToken}`;

  const html = `
    <h2>Reset your password</h2>
    <p>Click the link below to reset your password.</p>
    <a href="${resetUrl}">Reset Password</a>
    <p>This link will expire in 15 minutes.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Reset your password",
    html,
  });
};

export const resetPassword = async (rawToken, newPassword) => {
  if (!rawToken || !newPassword) {
    throw new AppError("Token and new password are required", 400);
  }

  const tokenHash = hashToken(rawToken);

  const resetRecord = await findPasswordResetByTokenHash(tokenHash);

  if (!resetRecord) {
    throw new AppError("Invalid or expired reset token", 400);
  }

  if (resetRecord.usedAt) {
    throw new AppError("This reset token has already been used", 400);
  }

  if (resetRecord.expiresAt < new Date()) {
    throw new AppError("Reset token has expired", 400);
  }

  const user = await findUserById(resetRecord.userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await updateUserPassword(user._id, hashedPassword);

  await markPasswordResetAsUsed(resetRecord._id);

  await revokeAllUserRefreshTokens(user._id);

  return user;
};
