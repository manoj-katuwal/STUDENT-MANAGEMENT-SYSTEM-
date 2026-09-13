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

export const exportFeeStructuresCsv = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

  const response = await apiClient.get("/fee-structures/export/csv", {
    params: cleanParams,
    responseType: "blob",
  });

  return response.data;
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

export const createFeeStructure = async (feeStructureData) => {
  const response = await apiClient.post("/fee-structures", feeStructureData);

  return response.data.data;
};


export const deactivateFeeStructure = async (feeStructureId) => {
  const response = await apiClient.patch(
    `/fee-structures/${feeStructureId}/deactivate`,
  );

  return response.data.data;
};

export const activateFeeStructure = async (feeStructureId) => {
  const response = await apiClient.patch(
    `/fee-structures/${feeStructureId}/activate`,
  );

  return response.data.data;
};




