import { useState } from "react";
import AcademicYearChart from "../components/reports/AcademicYearChart";
import PaymentMethodChart from "../components/reports/PaymentMethodChart";
import RecentPayments from "../components/reports/RecentPayments";
import ReportContextBar from "../components/reports/ReportContextBar";
import ReportHeader from "../components/reports/ReportHeader";
import ReportSummaryCards from "../components/reports/ReportSummaryCards";
import {
  useDashboardSummary,
  useExportDashboardReportCsv,
} from "../features/reports/report.hooks";
import { useAcademicYears } from "../features/academicYear/academicYear.hooks";

function ReportsPage() {
  const [academicYearId, setAcademicYearId] = useState("");
  const { data, isLoading, isError, refetch, isFetching } =
    useDashboardSummary(academicYearId || undefined);
  const { data: academicYearsData, isLoading: isAcademicYearsLoading } =
    useAcademicYears({ page: 1, limit: 100 });
  const exportReportMutation = useExportDashboardReportCsv();

  const handleExport = async () => {
    const activeAcademicYearId = academicYearId || data?.academicYear?._id;
    const csv = await exportReportMutation.mutateAsync(activeAcademicYearId);
    const downloadUrl = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `fee-report-${data?.academicYear?.name ?? "academic-year"}.csv`;
    link.click();
    URL.revokeObjectURL(downloadUrl);
  };

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <ReportContextBar />
      <ReportHeader
        academicYear={data?.academicYear}
        academicYears={academicYearsData?.academicYears ?? []}
        selectedAcademicYearId={academicYearId || data?.academicYear?._id || ""}
        onAcademicYearChange={setAcademicYearId}
        isLoading={isLoading || isAcademicYearsLoading}
        onExport={handleExport}
        isExporting={exportReportMutation.isPending}
      />
      <ReportSummaryCards
        data={data}
        isLoading={isLoading}
        onRetry={refetch}
        isRetrying={isFetching}
        isError={isError}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <PaymentMethodChart
          data={data?.paymentMethods ?? []}
          isLoading={isLoading}
        />
        <AcademicYearChart
          data={data?.academicYearSummary ?? []}
          isLoading={isLoading}
        />
      </div>

      <RecentPayments
        data={data?.recentPayments ?? []}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        isRetrying={isFetching}
      />
    </div>
  );
}

export default ReportsPage;
