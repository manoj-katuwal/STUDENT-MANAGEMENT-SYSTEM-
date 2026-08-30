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
