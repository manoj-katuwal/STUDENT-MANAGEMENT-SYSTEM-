import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { getFeeStructureById, getFeeStructures, getFeeStructureStats, updateFeeStructure } from "./feeStructure.api";

export const useFeeStructures = (params = {}) => {
  return useQuery({
    queryKey: ["feeStructures", params],
    queryFn: () => getFeeStructures(params),
    placeholderData: keepPreviousData,
  });
};

export const useFeeStructureStats = () => {
  return useQuery({
    queryKey: ["feeStructureStats"],
    queryFn: getFeeStructureStats,
  });
};


export const useFeeStructure = (feeStructureId) => {
  return useQuery({
    queryKey: ["feeStructure", feeStructureId],
    queryFn: () => getFeeStructureById(feeStructureId),
    enabled: Boolean(feeStructureId),
  });
};

export const useUpdateFeeStructure = () => {
  return useMutation({
    mutationFn: ({ feeStructureId, updateData }) =>
      updateFeeStructure(feeStructureId, updateData),
  });
};
