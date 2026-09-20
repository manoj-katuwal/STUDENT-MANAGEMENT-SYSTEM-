import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "./report.api";

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: getDashboardSummary,
  });
};
