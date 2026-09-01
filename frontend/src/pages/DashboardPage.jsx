import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/auth.context";
import { useLogout } from "../features/auth/auth.hooks";
import { useDashboardData } from "../hooks/useDashboardData";
import DashboardStatCard from "../components/dashboard/DashboardStats";
import PaymentMethods from "../components/dashboard/PaymentMethods";
import RecentPayments from "../components/dashboard/RecentPayments";
import AcademicYearSummary from "../components/dashboard/AcademicYearSummary";
import { formatCurrency } from "../utils/formatCurrency";
import DashboardLoading from "../components/dashboard/DashboardLoading";
import DashboardError from "../components/dashboard/DashboardError";
import DashboardHeader from "../components/dashboard/DashboardHeader";
import DashboardStats from "../components/dashboard/DashboardStats";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  const {
    data: dashboard,
    isLoading,
    isError,
    error,
    refetch,
  } = useDashboardData();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate("/login", { replace: true });
      },
    });
  };

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (isError) {
    return <DashboardError onRetry={refetch} />;
  }

  return (
    <div className="min-h-full p-6 lg:p-8">
      <DashboardHeader />

      <DashboardStats data={dashboard} />
    </div>
  );
}

export default DashboardPage;
