import { createEmailVerification } from "./emailVerification.repository.js";

// import {
//   generateRefreshToken,
//   hashToken,
// } from "../../../shared/utils/auth/token.js";

import { generateRefreshToken, hashToken } from "../../../shared/utils/auth/token.js";



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
