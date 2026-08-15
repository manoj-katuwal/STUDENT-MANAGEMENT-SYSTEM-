// import { useId } from "react";
import bcrypt from "bcryptjs";
import { hashToken } from "../../shared/utils/auth/token.js";
import AppError from "../../shared/utils/error/AppError.js";
import {
  findPasswordResetByTokenHash,
  markPasswordResetAsUsed,
} from "../auth/passwordReset/passwordReset.repository.js";
import User from "./user.model.js";
import { revokeAllUserRefreshTokens } from "../auth/refreshToken/refreshToken.repository.js";

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const findUserById = async (userId) => {
  return await User.findById(userId);
};

export const findUserByEmailWithPassword = async (email) => {
  return await User.findOne({ email }).select("+password");
};
export const findUserByIdWithPassword = async (userId) => {
  return await User.findById(userId).select("+password");
};

export const updateUserPassword = async (userId, passwordHash) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      password: passwordHash,
    },
    {
      new: true,
    },
  );
};

export const verifyUserEmail = async (userId) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      isEmailVerified: true,
    },
    {
      new: true,
    },
  );
};

export const findAllUsers = async ({ role, isActive, search } = {}) => {
  const filter = {};

  if (role) {
    filter.role = role;
  }

  if (typeof isActive === "boolean") {
    filter.isActive = isActive;
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  return await User.find(filter).sort({ createdAt: -1 });
};

export const updateUserRole = async (userId, role) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      role,
    },
    {
      new: true,
    },
  );
};

export const setUserActiveStatus = async (userId, isActive) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      isActive,
    },
    {
      new: true,
    },
  );
};

export const updateOwnProfile = async (userId, allowedData) => {
  return await User.findByIdAndUpdate(userId, allowedData, {
    new: true,
  });
};

