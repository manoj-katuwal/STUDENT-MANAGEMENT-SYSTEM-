import apiClient from "../../api/axios";

export const getDashboardSummary = async (academicYearId) => {
  const response = await apiClient.get("/reports/dashboard", {
    params: academicYearId ? { academicYearId } : {},
  });

  return response.data.data;
};

export const exportDashboardReportCsv = async (academicYearId) => {
  const response = await apiClient.get("/reports/export/csv", {
    params: academicYearId ? { academicYearId } : {},
    responseType: "blob",
  });

  return response.data;
};
