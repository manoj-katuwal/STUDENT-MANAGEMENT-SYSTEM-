import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/auth.context";
import { useLogout } from "../features/auth/auth.hooks";
import { useDashboardData } from "../hooks/useDashboardData";
import DashboardStatCard from "../components/dashboard/DashboardStats";
import PaymentMethods from "../components/dashboard/PaymentMethods";
import RecentPayments from "../components/dashboard/RecentPayments";
function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { mutate: logout, isPending } = useLogout();

  const { data: dashboard, isLoading, isError, error } = useDashboardData();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate("/login", { replace: true });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Failed to load dashboard: {error?.message || "Something went wrong"}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6">
      <h1 className="text-4xl font-bold">Dashboard</h1>
      <p>Welcome, {user?.name || "User"}</p>
      <p>Role: {user?.role || "Unknown"}</p>

      {/* Temporary raw JSON view */}
      <div className="w-full max-w-2xl overflow-auto rounded-lg bg-gray-100 p-4 text-sm dark:bg-gray-800">
        <pre>{JSON.stringify(dashboard, null, 2)}</pre>
      </div>

      <button
        onClick={handleLogout}
        disabled={isPending}
        className="rounded-lg bg-red-600 px-5 py-2 text-white disabled:opacity-50"
      >
        {isPending ? "Logging out..." : "Logout"}
      </button>

      <div className="grid w-full max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStatCard
          title="Today's Collection"
          value={`Rs. ${dashboard.todayCollection.totalCollection}`}
        />

        <DashboardStatCard
          title="Monthly Collection"
          value={`Rs. ${dashboard.monthlyCollection.totalCollection}`}
        />

        <DashboardStatCard
          title="Pending Fees"
          value={`Rs. ${dashboard.pendingFee.totalPending}`}
        />

        <DashboardStatCard
          title="Overdue Fees"
          value={`Rs. ${dashboard.overdueFee.totalOverdue}`}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <PaymentMethods paymentMethods={dashboard.paymentMethods} />

        <RecentPayments payments={dashboard.recentPayments} />
      </div>
    </div>
  );
}

export default DashboardPage;
