import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "./reports.api";

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: getDashboardSummary,
  });
};
