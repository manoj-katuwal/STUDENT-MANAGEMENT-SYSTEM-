import React from "react";
import {
  ClipboardList,
  Landmark,
  Hourglass,
  PieChart,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useStudentFeeLedgerSummary } from "../../features/studentFee/studentFee.hooks";

const SkeletonCard = () => (
  <div className="relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs animate-pulse">
    <div className="flex items-start justify-between gap-2">
      <div className="h-3 w-28 rounded bg-slate-200" />
      <div className="h-4 w-4 rounded bg-slate-200" />
    </div>
    <div className="mt-3.5 space-y-2">
      <div className="h-7 w-20 rounded bg-slate-200" />
      <div className="h-3 w-36 rounded bg-slate-100" />
    </div>
  </div>
);

const StudentFeeStats = () => {
  const {
    data: summary,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useStudentFeeLedgerSummary();

  const stats = [
    {
      title: "TOTAL OUTSTANDING",
      value: summary?.totalOutstanding ?? 0,
      icon: ClipboardList,
      iconColor: "text-red-500",
      hoverBar: "bg-red-500",
      description: "Active uncollected dues",
    },
    {
      title: "TOTAL COLLECTED",
      value: summary?.totalPaid ?? 0,
      icon: Landmark,
      iconColor: "text-emerald-500",
      hoverBar: "bg-emerald-500",
      description: "Total amount collected",
    },
    {
      title: "PENDING FEES",
      value: summary?.pendingFees ?? 0,
      icon: Hourglass,
      iconColor: "text-blue-500",
      hoverBar: "bg-blue-600",
      description: "Zero payments logged",
    },
    {
      title: "PARTIAL PAYMENTS",
      value: summary?.partialPayments ?? 0,
      icon: PieChart,
      iconColor: "text-slate-600",
      hoverBar: "bg-slate-700",
      description: "Installment active",
    },
    {
      title: "FULLY PAID",
      value: summary?.paidFees ?? 0,
      icon: CheckCircle2,
      iconColor: "text-slate-900",
      hoverBar: "bg-slate-900",
      description: "Cleared with zero dues",
    },
  ];

  // Loading skeleton
  if (isLoading) {
    return (
      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
        aria-label="Student Fee Statistics"
      >
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </section>
    );
  }

  // Error state
  if (isError) {
    return (
      <section
        className="rounded-xl border border-red-200 bg-red-50 p-5"
        aria-label="Student Fee Statistics Error"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm font-medium">
              Failed to load fee statistics. Please try again.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
            />
            {isFetching ? "Retrying…" : "Retry"}
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5"
      aria-label="Student Fee Statistics"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            {/* Header: Title & Icon */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 leading-tight">
                {stat.title}
              </span>
              <Icon
                className={`h-4 w-4 shrink-0 ${stat.iconColor}`}
                aria-hidden="true"
              />
            </div>

            {/* Value & Description */}
            <div className="mt-3.5">
              <p className="text-xl font-bold tracking-tight text-slate-900 xl:text-2xl">
                {stat.value}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                {stat.description}
              </p>
            </div>

            {/* Refetch indicator dot (while background refetching) */}
            {isFetching && (
              <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
            )}

            {/* Bottom Hover Animation Line */}
            <div
              className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${stat.hoverBar}`}
            />
          </div>
        );
      })}
    </section>
  );
};

export default StudentFeeStats;
