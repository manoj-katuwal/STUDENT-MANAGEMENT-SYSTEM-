import apiClient from "../../api/axios";

export const getUsers = async (params = {}) => {
  const response = await apiClient.get("/users", {
    params,
  });

  return response.data.data;
};
