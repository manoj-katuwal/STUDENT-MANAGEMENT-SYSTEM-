import React from "react";
import { Sparkles, Plus, Calendar } from "lucide-react";
import { useAuth } from "../../features/auth/auth.context";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const getFormattedDate = () =>
  new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

const DashboardHeader = () => {
  const { user } = useAuth();

  const firstName = user?.name ? user.name.split(" ")[0] : "there";

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between font-body">
      {/* Left: Greeting & Subtitle */}
      <div>
        <h1 className="flex items-center gap-2.5 font-display text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          {getGreeting()}, {firstName}
          <Sparkles
            className="h-6 w-6 text-amber-500 fill-amber-500/20"
            aria-hidden="true"
          />
        </h1>
        <p className="mt-1 text-sm text-slate-500 font-medium">
          Here's an overview of your school's financial activity.
        </p>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-3">
        {/* Date Selector */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm">
          <Calendar className="h-4 w-4 text-slate-400" aria-hidden="true" />
          <span>{getFormattedDate()}</span>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/30 transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>Collect Fee</span>
        </button>
      </div>
    </div>
  );
};

export default DashboardHeader;
