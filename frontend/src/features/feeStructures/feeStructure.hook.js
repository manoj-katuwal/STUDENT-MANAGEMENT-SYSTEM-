import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getFeeStructures, getFeeStructureStats } from "./feeStructure.api";

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
