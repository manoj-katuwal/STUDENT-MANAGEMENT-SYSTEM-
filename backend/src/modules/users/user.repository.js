// import { useId } from "react";
import User from "./user.model.js";

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