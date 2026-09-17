import apiClient from "../../api/axios";

export const getPayments = async (params = {}) => {
  const response = await apiClient.get("/payments", {
    params,
  });

  return {
    payments: response.data.data,
    pagination: response.data.meta,
  };
};

export const getPaymentById = async (paymentId) => {
  const response = await apiClient.get(`/payments/${paymentId}`);

  return response.data.data;
};

export const getPaymentsByStudentFee = async (studentFeeId) => {
  const response = await apiClient.get(`/payments/student-fee/${studentFeeId}`);

  return response.data.data;
};

export const createOfflinePayment = async (paymentData) => {
  const response = await apiClient.post("/payments/offline", paymentData);

  return response.data.data;
};

export const getPaymentStats = async () => {
  const response = await apiClient.get("/payments/stats");

  return response.data.data;
};

export const getReceiptByPaymentId = async (paymentId) => {
  const response = await apiClient.get(`/receipts/payment/${paymentId}`);

  return response.data.data;
};

