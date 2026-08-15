import {
  createEmailVerification,
  deleteUnusedVerificationsByUserId,
  findEmailVerificationByTokenHash,
  markEmailVerificationAsUsed,
} from "./emailVerification.repository.js";

import {
  generateRefreshToken,
  hashToken,
} from "../../../shared/utils/auth/token.js";
import { sendEmail } from "../../../shared/services/email/email.service.js";
import {
  findUserByEmail,
  verifyUserEmail,
} from "../../users/user.repository.js";
import AppError from "../../../shared/utils/error/AppError.js";

export const createEmailVerificationToken = async (userId) => {
  const rawToken = generateRefreshToken();

  const tokenHash = hashToken(rawToken);

  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  await createEmailVerification({
    userId,
    tokenHash,
    expiresAt,
  });

  return rawToken;
};

export const verifyEmail = async (rawToken) => {
  if (!rawToken) {
    throw new AppError("Verification token is required", 400);
  }

  const tokenHash = hashToken(rawToken);

  const verification = await findEmailVerificationByTokenHash(tokenHash);

  if (!verification) {
    throw new AppError("Invalid or expired verification token", 400);
  }

  if (verification.usedAt) {
    throw new AppError("Verification token has already been used", 400);
  }

  if (verification.expiresAt < new Date()) {
    throw new AppError("Verification token has expired", 400);
  }

  const user = await verifyUserEmail(verification.userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  await markEmailVerificationAsUsed(verification._id);

  return user;
};
export const resendVerificationEmail = async (email) => {
  if (!email) {
    throw new AppError("Email is required", 400);
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return;
  }

  if (user.isEmailVerified) {
    throw new AppError("Email is already verified", 400);
  }

  await deleteUnusedVerificationsByUserId(user._id);

  const rawToken = generateRefreshToken();
  const tokenHash = hashToken(rawToken);

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 घण्टा, तिम्रो existing expiry जस्तै राख

  await createEmailVerification({
    userId: user._id,
    tokenHash,
    expiresAt,
  });

  if (process.env.NODE_ENV !== "production") {
    console.log("🔑 DEV RESEND VERIFICATION TOKEN:", rawToken);
  }

  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${rawToken}`;

  const html = `
    <h2>Verify your email</h2>
    <p>Please click the link below to verify your email address.</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>This link will expire in 24 hours.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html,
  });
};
