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

