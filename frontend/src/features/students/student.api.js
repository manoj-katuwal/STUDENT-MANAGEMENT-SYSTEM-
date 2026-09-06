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

