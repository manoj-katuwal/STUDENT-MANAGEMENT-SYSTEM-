import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "./report.api";

export const useDashboardSummary = (academicYearId) => {
  return useQuery({
    queryKey: ["reports", "dashboard", academicYearId ?? "current"],
    queryFn: () => getDashboardSummary(academicYearId),
  });
};
