import bcrypt from "bcryptjs";

import * as refreshTokenRepository from "../../modules/auth/refreshToken/refreshToken.repository.js";
import { sendEmail } from "../../shared/services/email/email.service.js";
import AppError from "../../shared/utils/error/AppError.js";
import User from "./user.model.js";
import {
  createUser as createUserRecord,
  findUserByEmail,
  findUserById,
  findUserByIdWithPassword,
  updateUserPassword,
} from "./user.repository.js";
import { createEmailVerificationToken } from "../auth/emailVerification/emailVerification.service.js";

export const registerUser = async ({ name, email, password }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("User with this email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await createUserRecord({
    name,
    email,
    password: hashedPassword,
    role: "STUDENT",
  });

  const verificationToken = await createEmailVerificationToken(user._id);
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  const html = `
    <h2>Verify your email</h2>
    <p>Please click the link below to verify your email address.</p>
    <a href="${verificationUrl}">Verify Email</a>
    <p>This link will expire in 30 minutes.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: "Verify your email",
    html,
  });

  return user;
};

export const changeUserPassword = async (userId, currentPassword, newPassword) => {
  const user = await findUserByIdWithPassword(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new AppError("Current Password is incorrect", 404);
  }

  const isSamePassword = await bcrypt.compare(newPassword, user.password);

  if (isSamePassword) {
    throw new AppError(
      "New password must be different from current password",
      404,
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await updateUserPassword(userId, hashedPassword);
  await refreshTokenRepository.revokeAllUserRefreshTokens(userId);
};

export const createNewUser = async ({ name, email, password, role }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("User with this email already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await createUserRecord({
    name,
    email,
    password: hashedPassword,
    role,
  });

  return user;
};

export const findAllUsers = async ({ role, isActive, search } = {}) => {
  const filter = {};

  if (role) filter.role = role;
  if (typeof isActive === "boolean") filter.isActive = isActive;

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  return await User.find(filter).sort({ createdAt: -1 });
};

export const updateUserRole = async (userId, role) => {
  return await User.findByIdAndUpdate(userId, { role }, { new: true });
};

export const setUserActiveStatus = async (userId, isActive) => {
  return await User.findByIdAndUpdate(userId, { isActive }, { new: true });
};

export const updateOwnProfile = async (userId, allowedData) => {
  return await User.findByIdAndUpdate(userId, allowedData, { new: true });
};

const ensureNotSelf = (requesterId, targetUserId, action) => {
  if (String(requesterId) === String(targetUserId)) {
    throw new AppError(`You cannot ${action} your own account`, 400);
  }
};

export const getAllUsers = async (filters) => {
  return await findAllUsers(filters);
};

export const getUserById = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return user;
};

export const changeUserRole = async (requesterId, targetUserId, newRole) => {
  ensureNotSelf(requesterId, targetUserId, "change the role of");

  const user = await findUserById(targetUserId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return await updateUserRole(targetUserId, newRole);
};

export const activateUser = async (targetUserId) => {
  const user = await findUserById(targetUserId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return await setUserActiveStatus(targetUserId, true);
};

export const deactivateUser = async (requesterId, targetUserId) => {
  ensureNotSelf(requesterId, targetUserId, "deactivate");

  const user = await findUserById(targetUserId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const updatedUser = await setUserActiveStatus(targetUserId, false);
  await refreshTokenRepository.revokeAllUserRefreshTokens(targetUserId);

  return updatedUser;
};

export const deleteUser = async (requesterId, targetUserId) => {
  ensureNotSelf(requesterId, targetUserId, "delete");

  const user = await findUserById(targetUserId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const updatedUser = await setUserActiveStatus(targetUserId, false);
  await refreshTokenRepository.revokeAllUserRefreshTokens(targetUserId);

  return updatedUser;
};

export const updateMyProfile = async (userId, data) => {
  const allowedFields = ["name"];
  const filteredData = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      filteredData[field] = data[field];
    }
  }

  if (Object.keys(filteredData).length === 0) {
    throw new AppError("No valid fields to update", 400);
  }

  return await updateOwnProfile(userId, filteredData);
};
