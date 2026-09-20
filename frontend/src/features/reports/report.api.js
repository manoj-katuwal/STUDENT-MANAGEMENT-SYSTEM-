import apiClient from "../../api/axios";

export const getDashboardSummary = async (academicYearId) => {
  const response = await apiClient.get("/reports/dashboard", {
    params: academicYearId ? { academicYearId } : {},
  });

  return response.data.data;
};
