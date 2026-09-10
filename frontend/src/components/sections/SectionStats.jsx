import React from "react";
import {
  Layers3,
  CheckCircle2,
  PauseCircle,
  CalendarPlus,
  TrendingUp,
  Info,
  Clock,
} from "lucide-react";

const SectionStats = ({ stats, loading = false, error = false, onRetry }) => {
  if (loading) {
    return (
      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Loading section statistics"
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-slate-100 bg-white p-5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 rounded bg-slate-200" />
              <div className="h-10 w-10 rounded-2xl bg-slate-100" />
            </div>
            <div className="mt-3.5 space-y-2">
              <div className="h-8 w-16 rounded bg-slate-200" />
              <div className="h-3 w-32 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </section>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50/50 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-red-800">
              Failed to load section statistics
            </p>
            <p className="mt-0.5 text-xs text-red-600">Please try again.</p>
          </div>
          <button
            type="button"
            onClick={onRetry}
            className="cursor-pointer rounded-lg bg-white px-4 py-2 text-xs font-semibold text-red-700 shadow-xs ring-1 ring-inset ring-red-200 transition hover:bg-red-50"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const {
    totalSections = 0,
    activeSections = 0,
    inactiveSections = 0,
    recentlyAdded = 0,
    thisAcademicYear = 4,
  } = stats || {};

  const activePercentage =
    totalSections > 0
      ? ((activeSections / totalSections) * 100).toFixed(1)
      : "0.0";

  const statCards = [
    {
      title: "Total Sections",
      value: totalSections.toLocaleString(),
      icon: Layers3,
      bg: "bg-blue-50/80 text-blue-600",
      hoverBar: "bg-blue-500",
      subtext: `+${thisAcademicYear} this academic year`,
      subtextClass: "text-emerald-600 font-medium",
      showTrend: true,
    },
    {
      title: "Active Sections",
      value: activeSections.toLocaleString(),
      icon: CheckCircle2,
      bg: "bg-emerald-50/80 text-emerald-500",
      hoverBar: "bg-emerald-500",
      subtext: `${activePercentage}% in session`,
      subtextClass: "text-slate-500 font-medium",
      showProgress: true,
      progressWidth: `${Math.min(100, Math.max(0, parseFloat(activePercentage)))}%`,
    },
    {
      title: "Inactive Sections",
      value: inactiveSections.toLocaleString(),
      icon: PauseCircle,
      bg: "bg-slate-100/70 text-slate-500",
      hoverBar: "bg-slate-400",
      subtext: "Archived or upcoming",
      subtextClass: "text-slate-500 font-medium",
      showInfoIcon: true,
    },
    {
      title: "Recently Added",
      value: recentlyAdded.toLocaleString(),
      icon: CalendarPlus,
      bg: "bg-blue-50/80 text-blue-600",
      hoverBar: "bg-blue-500",
      subtext: "Past 30 days intake",
      subtextClass: "text-blue-600 font-medium",
      showClockIcon: true,
    },
  ];

  return (
    <section
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Section Statistics"
    >
      {statCards.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* Top Row: Title & Badge */}
            <div className="flex items-start justify-between gap-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {stat.title}
              </span>
              <div
                className={`flex shrink-0 items-center justify-center rounded-2xl p-3 transition-transform duration-200 group-hover:scale-105 ${stat.bg}`}
              >
                <Icon className="h-5 w-5 stroke-[2.5]" aria-hidden="true" />
              </div>
            </div>

            {/* Middle Row: Big Value */}
            <div className="mt-1">
              <p className="text-3xl font-extrabold tracking-tight text-slate-900">
                {stat.value}
              </p>

              {/* Bottom Info line */}
              <div className="mt-4 flex items-center gap-1.5 text-xs">
                {stat.showTrend && (
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                )}
                {stat.showInfoIcon && (
                  <Info className="h-3.5 w-3.5 text-slate-400" />
                )}
                {stat.showClockIcon && (
                  <Clock className="h-3.5 w-3.5 text-blue-600" />
                )}

                <span className={stat.subtextClass}>{stat.subtext}</span>

                {stat.showProgress && (
                  <div className="ml-1 h-1.5 w-16 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                      style={{ width: stat.progressWidth }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Accent Hover Line */}
            <div
              className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${stat.hoverBar}`}
            />
          </div>
        );
      })}
    </section>
  );
};

export default SectionStats;
