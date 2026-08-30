import React from "react";
import { useAuth } from "../features/auth/auth.context";

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">Dashboard</h1>

      <p>Welcome, {user?.name || "User"}</p>

      <p>Role: {user?.role || "Unknown"}</p>

      <button
        onClick={logout}
        className="rounded-lg bg-red-600 px-5 py-2 text-white"
      >
        Temporary Logout
      </button>
    </div>
  );
};

export default DashboardPage;
