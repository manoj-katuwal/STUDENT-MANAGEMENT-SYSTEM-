import EmailVerification from "./emailVerification.model.js";

export const createEmailVerification = async (data) => {
  return await EmailVerification.create(data);
};

export const findEmailVerificationByTokenHash = async (tokenHash) => {
  return await EmailVerification.findOne({
    tokenHash,
  });
};

export const markEmailVerificationAsUsed = async (verificationId) => {
  return await EmailVerification.findByIdAndUpdate(
    verificationId,
    {
      usedAt: new Date(),
    },
    {
      new: true,
    },
  );
};

export const deleteUnusedVerificationsByUserId = async (userId) => {
  return await EmailVerification.deleteMany({
    userId,
    usedAt: null,
  });
};
