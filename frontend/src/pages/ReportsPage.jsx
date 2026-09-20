import ReportContextBar from "../components/reports/ReportContextBar";
import ReportHeader from "../components/reports/ReportHeader";
import ReportSummaryCards from "../components/reports/ReportSummaryCards";
import { useDashboardSummary } from "../features/reports/report.hooks";

function ReportsPage() {
  const { data, isLoading, isError, refetch, isFetching } =
    useDashboardSummary();
  console.log(data);
  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <ReportContextBar />
      <ReportHeader />
      <ReportSummaryCards
        data={data}
        isLoading={isLoading}
        onRetry={refetch}
        isRetrying={isFetching}
        isError={isError}
      />
    </div>
  );
}

export default ReportsPage;
