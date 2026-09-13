import apiClient from "../../api/axios";

export const getFeeStructures = async (params = {}) => {
  const response = await apiClient.get("/fee-structures", {
    params,
  });

  return {
    feeStructures: response.data.data,
    pagination: response.data.meta,
  };
};

export const getFeeStructureStats = async () => {
  const response = await apiClient.get("/fee-structures/stats");

  return response.data.data;
};

export const getFeeStructureById = async (feeStructureId) => {
  const response = await apiClient.get(`/fee-structures/${feeStructureId}`);

  return response.data.data;
};


export const updateFeeStructure = async (feeStructureId, updateData) => {
  const response = await apiClient.patch(
    `/fee-structures/${feeStructureId}`,
    updateData,
  );

  return response.data.data;
};


