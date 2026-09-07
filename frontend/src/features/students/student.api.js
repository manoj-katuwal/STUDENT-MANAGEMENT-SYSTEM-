import apiClient from "../../api/axios";

export const getStudents = async (params = {}) => {
  const response = await apiClient.get("/students", {
    params,
  });

  return {
    students: response.data.data,
    pagination: response.data.meta,
  };
};

export const getStudentStats = async () => {
  const response = await apiClient.get("/students/stats");

  return response.data.data;
};

export const getStudentById = async (studentId) => {
  const response = await apiClient.get(`/students/${studentId}`);

  return response.data.data;
};

export const updateStudent = async (studentId, data) => {
  const response = await apiClient.patch(`/students/${studentId}`, data);

  return response.data.data;
};

export const createStudent = async (data) => {
  const response = await apiClient.post("/students", data);

  return response.data.data;
};

