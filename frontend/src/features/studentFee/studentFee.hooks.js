import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  cancelStudentFee,
  createStudentFee,
  getStudentFeeById,
  getStudentFeeLedgerSummary,
  getStudentFees,
  getStudentFeeSummary,
  updateStudentFee,
} from "./studentFee.api";

export const useStudentFees = (params) => {
  return useQuery({
    queryKey: ["studentFees", params],
    queryFn: () => getStudentFees(params),
    placeholderData: keepPreviousData,
  });
};

export const useStudentFee = (studentFeeId) => {
  return useQuery({
    queryKey: ["studentFee", studentFeeId],
    queryFn: () => getStudentFeeById(studentFeeId),
    enabled: Boolean(studentFeeId),
  });
};

export const useStudentFeeSummary = (studentId) => {
  return useQuery({
    queryKey: ["studentFeeSummary", studentId],
    queryFn: () => getStudentFeeSummary(studentId),
    enabled: Boolean(studentId),
  });
};

export const useCreateStudentFee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStudentFee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["studentFees"] });
      queryClient.invalidateQueries({ queryKey: ["studentFeeSummary"] });
      queryClient.invalidateQueries({ queryKey: ["studentFeeLedgerSummary"] });
    },
  });
};

export const useUpdateStudentFee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentFeeId, updateData }) =>
      updateStudentFee(studentFeeId, updateData),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["studentFees"] });
      queryClient.invalidateQueries({
        queryKey: ["studentFee", variables.studentFeeId],
      });
      queryClient.invalidateQueries({ queryKey: ["studentFeeSummary"] });
      queryClient.invalidateQueries({ queryKey: ["studentFeeLedgerSummary"] });
    },
  });
};

export const useCancelStudentFee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelStudentFee,

    onSuccess: (_, studentFeeId) => {
      queryClient.invalidateQueries({ queryKey: ["studentFees"] });
      queryClient.invalidateQueries({ queryKey: ["studentFee", studentFeeId] });
      queryClient.invalidateQueries({ queryKey: ["studentFeeSummary"] });
      queryClient.invalidateQueries({ queryKey: ["studentFeeLedgerSummary"] });
    },
  });
};

export const useStudentFeeLedgerSummary = () => {
  return useQuery({
    queryKey: ["studentFeeLedgerSummary"],
    queryFn: getStudentFeeLedgerSummary,
  });
};
