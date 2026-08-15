import "dotenv/config";
import jwt from "jsonwebtoken";
import AppError from "../shared/utils/error/AppError.js";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

if (!JWT_ACCESS_SECRET) {
  throw new AppError("JWT_ACCESS_SECRET is not configured", 400);
}

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
    },
    JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_ACCESS_SECRET);
};
