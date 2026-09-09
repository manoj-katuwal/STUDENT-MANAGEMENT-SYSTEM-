import apiClient from "../../api/axios";

export const getClasses = async (params = {}) => {
  const response = await apiClient.get("/classes", {
    params,
  });

  return {
    classes: response.data.data.classes,
    pagination: response.data.data.pagination,
  };
};

export const getClassById = async (classId) => {
  const response = await apiClient.get(`/classes/${classId}`);

  return response.data.data;
};

export const createClass = async (data) => {
  const response = await apiClient.post("/classes", data);

  return response.data.data;
};

export const updateClass = async (classId, data) => {
  const response = await apiClient.patch(`/classes/${classId}`, data);

  return response.data.data;
};

export const updateClassStatus = async (classId, status) => {
  const response = await apiClient.patch(`/classes/${classId}/status`, {
    status,
  });

  return response.data.data;
};

export const getClassStats = async () => {
  const response = await apiClient.get("/classes/stats");

  return response.data.data;
};

export const exportClassesCsv = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

  const response = await apiClient.get("/classes/export/csv", {
    params: cleanParams,
    responseType: "blob",
  });

  return response.data;
};
