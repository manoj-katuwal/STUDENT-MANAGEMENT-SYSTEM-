import RefreshToken from "./refreshToken.model.js";

export const findActiveRefreshToken = async (tokenHash) => {
  return RefreshToken.findOne({
    tokenHash,
    revokedAt: null,
    expiresAt: { $gt: new Date() },
  });
};

export const revokeRefreshToken = async (tokenId) => {
  return RefreshToken.findByIdAndUpdate(
    tokenId,
    {
      revokedAt: new Date(),
    },
    { new: true },
  );
};

export const createRefreshToken = async (data) => {
  return RefreshToken.create(data);
};
