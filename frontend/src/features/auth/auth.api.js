import apiClient from "../../api/axios";
import refreshClient from "../../api/refreshClient";

export const loginUser = async (credentials) => {
  const response = await apiClient.post("/auth/login", credentials);

  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post("/auth/logout");

  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await refreshClient.post("/auth/refresh");

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");

  return response.data;
};

export const registerUser = async (userData) => {
  const response = await apiClient.post("/auth/register", userData);

  return response.data;
};

export const requestPasswordReset = async (email) => {
  const response = await apiClient.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async ({ token, newPassword }) => {
  const response = await apiClient.post("/auth/reset-password", { token, newPassword });
  return response.data;
};
