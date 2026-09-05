import apiClient from "../../api/axios";

export const getUsers = async (params = {}) => {
  const response = await apiClient.get("/users", {
    params,
  });

  return response.data.data;
};

export const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/users/${userId}`);

  return response.data;
};

export const activateUser = async (userId) => {
  const response = await apiClient.patch(`/users/${userId}/activate`);

  return response.data;
};

export const deactivateUser = async (userId) => {
  const response = await apiClient.patch(`/users/${userId}/deactivate`);

  return response.data;
};