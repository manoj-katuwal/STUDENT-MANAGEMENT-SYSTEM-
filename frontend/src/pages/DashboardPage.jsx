import { useState } from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import PaymentMethods from "../components/dashboard/PaymentMethods";
import RecentPayments from "../components/dashboard/RecentPayments";
import AcademicYearSummary from "../components/dashboard/AcademicYearSummary";
import DashboardLoading from "../components/dashboard/DashboardLoading";
import DashboardError from "../components/dashboard/DashboardError";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";
import RecordPaymentDrawer from "../components/payments/RecordPaymentDrawer";

function DashboardPage() {
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

  const {
    data: dashboard,
    isLoading,
    isError,
    error,
    refetch,
  } = useDashboardData();

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (isError) {
    return <DashboardError onRetry={refetch} />;
  }

  return (
    <div className="min-h-full p-6 lg:p-8">
      <DashboardHeader onCollectFee={() => setIsRecordPaymentOpen(true)} />

      <DashboardStats data={dashboard} />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <PaymentMethods paymentMethods={dashboard.paymentMethods} />
        <RecentPayments payments={dashboard.recentPayments} />
      </div>

      <div className="mt-8">
        <AcademicYearSummary summaries={dashboard?.academicYearSummary} />
      </div>

      {isRecordPaymentOpen && (
        <RecordPaymentDrawer onClose={() => setIsRecordPaymentOpen(false)} />
      )}
    </div>
  );
}

export default DashboardPage;
