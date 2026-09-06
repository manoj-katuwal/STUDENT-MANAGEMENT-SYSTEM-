import React from "react";
import {
  GraduationCap,
  UserCheck,
  UserX,
  UserPlus,
  TrendingUp,
} from "lucide-react";

const StudentStats = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Loading student statistics"
      >
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="h-3.5 w-24 bg-slate-200 rounded"></div>
              <div className="h-9 w-9 bg-slate-100 rounded-lg"></div>
            </div>
            <div className="mt-3.5 space-y-2">
              <div className="h-7 w-20 bg-slate-200 rounded"></div>
              <div className="h-3 w-32 bg-slate-100 rounded"></div>
            </div>
          </div>
        ))}
      </section>
    );
  }

  const {
    totalStudents = 0,
    activeStudents = 0,
    inactiveStudents = 0,
    recentlyAdded = 0,
  } = data || {};

  const activePercentage =
    totalStudents > 0
      ? ((activeStudents / totalStudents) * 100).toFixed(1)
      : "0.0";

  const stats = [
    {
      title: "Total Students",
      value: totalStudents.toLocaleString(),
      icon: GraduationCap,
      bg: "bg-indigo-50 text-indigo-600 ring-indigo-200/60",
      hoverBar: "bg-indigo-500",
      subtext: `${recentlyAdded} added recently`,
      subtextClass: "text-emerald-600 font-semibold",
      showTrend: recentlyAdded > 0,
      description: "active academic year",
    },
    {
      title: "Active Students",
      value: activeStudents.toLocaleString(),
      icon: UserCheck,
      bg: "bg-emerald-50 text-emerald-600 ring-emerald-200/60",
      hoverBar: "bg-emerald-500",
      subtext: `${activePercentage}% enrollment`,
      subtextClass: "text-emerald-600 font-semibold",
      showProgress: true,
      progressWidth: `${Math.min(100, Math.max(0, parseFloat(activePercentage)))}%`,
    },
    {
      title: "Inactive Students",
      value: inactiveStudents.toLocaleString(),
      icon: UserX,
      bg: "bg-slate-100 text-slate-600 ring-slate-200/60",
      hoverBar: "bg-slate-500",
      description: "Currently inactive",
    },
    {
      title: "Recently Added",
      value: recentlyAdded.toLocaleString(),
      icon: UserPlus,
      bg: "bg-blue-50 text-blue-600 ring-blue-200/60",
      hoverBar: "bg-blue-500",
      description: "Past 30 days intake",
    },
  ];

  return (
    <section
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Student Statistics"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* Header: Title & Icon Badge */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {stat.title}
              </span>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 transition-transform duration-200 group-hover:scale-105 ${stat.bg}`}
              >
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
            </div>

            {/* Content: Value & Subtext/Progress */}
            <div className="mt-3">
              <p className="text-2xl font-bold tracking-tight text-slate-900 lg:text-3xl">
                {stat.value}
              </p>

              <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                {stat.showTrend && (
                  <span className="inline-flex items-center text-emerald-600 font-semibold gap-0.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {stat.subtext}
                  </span>
                )}

                {stat.subtext && !stat.showTrend && (
                  <span className={stat.subtextClass}>{stat.subtext}</span>
                )}

                {stat.description && (
                  <span className="text-slate-400">{stat.description}</span>
                )}
              </div>

              {/* Dynamic Progress bar for Active Students */}
              {stat.showProgress && (
                <div className="mt-2.5 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: stat.progressWidth }}
                  />
                </div>
              )}
            </div>

            {/* Bottom Hover Line */}
            <div
              className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${stat.hoverBar}`}
            />
          </div>
        );
      })}
    </section>
  );
};

export default StudentStats;
