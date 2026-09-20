import AcademicYearChart from "../components/reports/AcademicYearChart";
import PaymentMethodChart from "../components/reports/PaymentMethodChart";
import RecentPayments from "../components/reports/RecentPayments";
import ReportContextBar from "../components/reports/ReportContextBar";
import ReportHeader from "../components/reports/ReportHeader";
import ReportSummaryCards from "../components/reports/ReportSummaryCards";
import { useDashboardSummary } from "../features/reports/report.hooks";

function ReportsPage() {
  const { data, isLoading, isError, refetch, isFetching } =
    useDashboardSummary();
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
