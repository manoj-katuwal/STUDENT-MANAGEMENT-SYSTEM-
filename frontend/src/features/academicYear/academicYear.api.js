import apiClient from "../../api/axios";

export const getAcademicYears = async (params = {}) => {
  const response = await apiClient.get("/academic-years", {
    params,
  });

  return {
    academicYears: response.data.data,
    pagination: response.data.meta,
  };
};

export const getAcademicYearById = async (academicYearId) => {
  const response = await apiClient.get(`/academic-years/${academicYearId}`);

  return response.data.data;
};

export const createAcademicYear = async (academicYearData) => {
  const response = await apiClient.post("/academic-years", academicYearData);

  return response.data.data;
};

export const updateAcademicYear = async (academicYearId, academicYearData) => {
  const response = await apiClient.patch(
    `/academic-years/${academicYearId}`,
    academicYearData,
  );

  return response.data.data;
};

export const activateAcademicYear = async (academicYearId) => {
  const response = await apiClient.patch(
    `/academic-years/${academicYearId}/activate`,
  );

  return response.data.data;
};

export const deactivateAcademicYear = async (academicYearId) => {
  const response = await apiClient.patch(
    `/academic-years/${academicYearId}/deactivate`,
  );

  return response.data.data;
};

export const getAcademicYearStats = async () => {
  const response = await apiClient.get("/academic-years/stats");

  return response.data.data;
};

export const exportAcademicYearsCsv = async () => {
  const response = await apiClient.get("/academic-years/export/csv", {
    responseType: "blob",
  });

  return response.data;
};
