import ReportContextBar from "../components/reports/ReportContextBar";
import ReportHeader from "../components/reports/ReportHeader";

function ReportsPage() {
  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <ReportContextBar />
      <ReportHeader />
    </div>
  );
}

export default ReportsPage;
