import { useNavigate } from "react-router-dom";

import { useAuth } from "../features/auth/auth.context";
import { useLogout } from "../features/auth/auth.hooks";

function DashboardPage() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const { mutate: logout, isPending } = useLogout();

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        navigate("/login", { replace: true });
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Dashboard</h1>

      <p>Welcome, {user?.name || "User"}</p>

      <p>Role: {user?.role || "Unknown"}</p>

      <button
        onClick={handleLogout}
        disabled={isPending}
        className="rounded-lg bg-red-600 px-5 py-2 text-white disabled:opacity-50"
      >
        {isPending ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}

export default DashboardPage;
