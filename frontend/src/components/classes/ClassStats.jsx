import {
  GraduationCap,
  CheckCircle2,
  PauseCircle,
  UserPlus,
  TrendingUp,
  Info,
  AlertTriangle,
} from "lucide-react";
import ClassStatsSkeleton from "./ClassStatsSkeleton";
const ClassStats = ({ stats, isLoading, isError, refetch }) => {
  if (isLoading) {
    return <ClassStatsSkeleton />;
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-8 space-x-2 text-red-600">
        <AlertTriangle className="h-5 w-5" />
        <span>Failed to load class statistics.</span>
        {refetch && (
          <button
            onClick={() => refetch()}
            className="ml-2 rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  const total = stats?.totalClasses ?? 0;
  const active = stats?.activeClasses ?? 0;
  const inactive = stats?.inactiveClasses ?? 0;
  const recentlyAdded = stats?.recentlyAdded ?? 0;

  // Calculate percentage for active classes progress bar
  const activePercentage = total > 0 ? ((active / total) * 100).toFixed(1) : 0;

  const statCards = [
    {
      label: "TOTAL CLASSES",
      value: total,
      icon: GraduationCap,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      hoverBar: "bg-indigo-500", // Hover color
      footer: (
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>{recentlyAdded} added in the past 30 days</span>
        </div>
      ),
    },
    {
      label: "ACTIVE CLASSES",
      value: active,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      hoverBar: "bg-emerald-500",
      footer: (
        <div className="flex items-center justify-between gap-2 text-xs font-medium text-emerald-600">
          <span>{activePercentage}% in session</span>
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-emerald-100">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-300"
              style={{ width: `${Math.min(activePercentage, 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      label: "INACTIVE CLASSES",
      value: inactive,
      icon: PauseCircle,
      iconBg: "bg-indigo-50/70",
      iconColor: "text-indigo-600",
      hoverBar: "bg-slate-500",
      footer: (
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span>Archived or upcoming</span>
        </div>
      ),
    },
    {
      label: "RECENTLY ADDED",
      value: recentlyAdded,
      icon: UserPlus,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      hoverBar: "bg-blue-500",
      footer: (
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span>Classes created in the past 30 days</span>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statCards.map(
        ({ label, value, icon: Icon, iconBg, iconColor, hoverBar, footer }) => (
          <div
            key={label}
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold tracking-wider text-slate-500">
                    {label}
                  </p>
                  <p className="mt-2 text-3xl font-extrabold text-slate-900">
                    {value}
                  </p>
                </div>
                <div
                  className={`rounded-xl ${iconBg} p-2.5 transition-transform duration-200 group-hover:scale-105`}
                >
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-2">{footer}</div>
            {/* Bottom Hover Line */}
            <div
              className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${hoverBar}`}
            />
          </div>
        ),
      )}
    </div>
  );
};

export default ClassStats;
