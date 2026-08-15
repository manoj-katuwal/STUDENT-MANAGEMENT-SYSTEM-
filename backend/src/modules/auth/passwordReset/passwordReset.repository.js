import PasswordReset from "./passwordReset.model.js";

export const createPasswordReset = async ({ userId, tokenHash, expiresAt }) => {
  return await PasswordReset.create({
    userId,
    tokenHash,
    expiresAt,
  });
};

export const findPasswordResetByTokenHash = async (tokenHash) => {
  return await PasswordReset.findOne({ tokenHash });
};

export const markPasswordResetAsUsed = async (id) => {
  return await PasswordReset.findByIdAndUpdate(
    id,
    {
      usedAt: new Date(),
    },
    {
      new: true,
    },
  );
};

export const deleteUnusedPasswordResetsByUserId = async (userId) => {
  return await PasswordReset.deleteMany({
    userId,
    usedAt: null,
  });
};
