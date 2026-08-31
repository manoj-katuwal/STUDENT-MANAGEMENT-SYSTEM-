import apiClient from "./axios";

export const getDashboardData = async () => {
  const response = await apiClient.get("/reports/dashboard");

  return response.data.data;
};
