import apiClient from "../../api/axios";

export const getDashboardSummary = async () => {
  const response = await apiClient.get("/reports/dashboard");

  return response.data.data;
};