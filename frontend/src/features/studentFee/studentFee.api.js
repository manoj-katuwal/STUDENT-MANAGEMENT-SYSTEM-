import apiClient from "../../api/axios";

export const getStudentFees = async (params) => {
  const response = await apiClient.get("/student-fees", {
    params,
  });

  return response.data.data;
};

export const exportStudentFeeLedger = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    ),
  );

  const response = await apiClient.get("/exports/fee-collection", {
    params: cleanParams,
    responseType: "blob",
  });

  return response.data;
};

export const getStudentFeeById = async (studentFeeId) => {
  const response = await apiClient.get(`/student-fees/${studentFeeId}`);

  return response.data.data;
};

export const getStudentFeeSummary = async (studentId) => {
  const response = await apiClient.get(`/student-fees/summary/${studentId}`);

  return response.data.data;
};

export const createStudentFee = async (studentFeeData) => {
  const response = await apiClient.post("/student-fees", studentFeeData);

  return response.data.data;
};

export const updateStudentFee = async (studentFeeId, updateData) => {
  const response = await apiClient.patch(
    `/student-fees/${studentFeeId}`,
    updateData,
  );

  return response.data.data;
};

export const cancelStudentFee = async (studentFeeId) => {
  const response = await apiClient.patch(
    `/student-fees/${studentFeeId}/cancel`,
  );

  return response.data.data;
};

export const getStudentFeeLedgerSummary = async () => {
  const response = await apiClient.get("/student-fees/summary");
  return response.data.data;
};
