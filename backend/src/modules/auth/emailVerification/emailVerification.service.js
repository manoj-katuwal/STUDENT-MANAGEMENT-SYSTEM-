import {
  createEmailVerification,
  findEmailVerificationByTokenHash,
  markEmailVerificationAsUsed,
} from "./emailVerification.repository.js";

import {
  generateRefreshToken,
  hashToken,
} from "../../../shared/utils/auth/token.js";

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
