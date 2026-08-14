import User from "./user.model.js";

export const findById = async (userId) => {
  return await User.findById(userId);
};

export const findByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async (userData) => {
  return await User.create(userData);
};

export const findByEmailWithPassword = async (email) => {
  return await User.findOne({ email }).select("+password");
};