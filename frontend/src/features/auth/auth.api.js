import apiClient from "../../api/axios";

export const loginUser = async (credentials) => {
  const response = await apiClient.post("/auth/login", credentials);
  console.log(response);

  return response.data;
};

export const logoutUser = async () => {
  const response = await apiClient.post("/auth/logout");
  console.log(response);

  return response.data;
};

export const refreshAccessToken = async () => {
  const response = await apiClient.post("/auth/refresh");
  console.log(response);

  return response.data;
};


export const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");

  return response.data;
};
