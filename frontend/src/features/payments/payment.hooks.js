import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import {
  createOfflinePayment,
  downloadReceiptPdf,
  getPaymentStats,
  getReceiptByPaymentId,
} from "./payment.api";
import { getPayments } from "./payment.api";
import { getPaymentById } from "./payment.api";
import { getPaymentsByStudentFee } from "./payment.api";
import { getStudentFees } from "../studentFee/studentFee.api";

export const usePayments = (params = {}) => {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => getPayments(params),
    placeholderData: (previousData) => previousData,
  });
};

export const usePayment = (paymentId) => {
  return useQuery({
    queryKey: ["payment", paymentId],
    queryFn: () => getPaymentById(paymentId),
    enabled: Boolean(paymentId),
  });
};

export const useStudentFeePayments = (studentFeeId) => {
  return useQuery({
    queryKey: ["student-fee-payments", studentFeeId],
    queryFn: () => getPaymentsByStudentFee(studentFeeId),
    enabled: Boolean(studentFeeId),
  });
};

export const useCreateOfflinePayment = () => {
  return useMutation({
    mutationFn: createOfflinePayment,
  });
};

export const usePaymentStats = () => {
  return useQuery({
    queryKey: ["payment-stats"],
    queryFn: getPaymentStats,
  });
};

export const useReceiptByPaymentId = (paymentId) => {
  return useQuery({
    queryKey: ["receipt", paymentId],
    queryFn: () => getReceiptByPaymentId(paymentId),
    enabled: Boolean(paymentId),
  });
};

export const useDownloadReceiptPdf = () => {
  return useMutation({
    mutationFn: downloadReceiptPdf,
  });
};

export const usePaymentStudentFees = (params = {}) => {
  return useQuery({
    queryKey: ["payment-student-fees", params],
    queryFn: () => getStudentFees(params),
    enabled: Boolean(params.search?.trim()),
  });
};