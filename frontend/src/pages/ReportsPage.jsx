import ReportContextBar from "../components/reports/ReportContextBar";
import ReportHeader from "../components/reports/ReportHeader";
import ReportSummaryCards from "../components/reports/ReportSummaryCards";

function ReportsPage() {
  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <ReportContextBar />
      <ReportHeader />
      <ReportSummaryCards />
    </div>
  );
}

export default ReportsPage;
