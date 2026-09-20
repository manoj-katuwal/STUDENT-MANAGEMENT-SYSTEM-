import { useMutation, useQuery } from "@tanstack/react-query";
import { exportDashboardReportCsv, getDashboardSummary } from "./report.api";

export const useDashboardSummary = (academicYearId) => {
  return useQuery({
    queryKey: ["reports", "dashboard", academicYearId ?? "current"],
    queryFn: () => getDashboardSummary(academicYearId),
  });
};

export const useExportDashboardReportCsv = () =>
  useMutation({ mutationFn: exportDashboardReportCsv });
