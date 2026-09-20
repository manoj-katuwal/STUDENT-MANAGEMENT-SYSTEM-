import PaymentMethodChart from "../components/reports/PaymentMethodChart";
import ReportContextBar from "../components/reports/ReportContextBar";
import ReportHeader from "../components/reports/ReportHeader";
import ReportSummaryCards from "../components/reports/ReportSummaryCards";
import { useDashboardSummary } from "../features/reports/report.hooks";

function ReportsPage() {
  const { data, isLoading, isError, refetch, isFetching } =
    useDashboardSummary();
  console.log(data);
  console.log("Payment methods:", data?.paymentMethods);
  console.log("Academic year summary:", data?.academicYearSummary);

  const paymentMethodData = data?.paymentMethods ?? [];
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

      <div>
        {paymentMethodData.map((item) => (
          <div key={item.paymentMethod}>
            {item.paymentMethod}: Rs.{" "}
            {Number(item.totalCollection).toLocaleString("en-IN")}
          </div>
        ))}
      </div>

      <PaymentMethodChart data={data?.paymentMethods ?? []} />
    </div>
  );
}

export default ReportsPage;
