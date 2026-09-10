import apiClient from "../../api/axios";

export const getSections = async (params = {}) => {
  const response = await apiClient.get("/sections", { params });

  return {
    sections: response.data.data.sections,
    pagination: response.data.data.pagination,
  };
};

export const getSectionStats = async () => {
  const response = await apiClient.get("/sections/stats");

  return response.data.data;
};

export const getSectionById = async (sectionId) => {
  const response = await apiClient.get(`/sections/${sectionId}`);

  return response.data.data;
};

export const createSection = async (data) => {
  const response = await apiClient.post("/sections", data);

  return response.data.data;
};

export const updateSection = async (sectionId, data) => {
  const response = await apiClient.patch(`/sections/${sectionId}`, data);

  return response.data.data;
};

export const updateSectionStatus = async (sectionId, status) => {
  const response = await apiClient.patch(`/sections/${sectionId}/status`, {
    status,
  });

  return response.data.data;
};

export const exportSectionsCsv = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

  const response = await apiClient.get("/sections/export/csv", {
    params: cleanParams,
    responseType: "blob",
  });

  return response.data;
};
