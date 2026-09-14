import React from "react";
import {
  ClipboardList,
  Landmark,
  Hourglass,
  PieChart,
  CheckCircle2,
} from "lucide-react";

const StudentFeeStats = () => {
  const stats = [
    {
      title: "TOTAL OUTSTANDING",
      value: "NPR 1,842,500",
      icon: ClipboardList,
      iconColor: "text-red-500",
      hoverBar: "bg-red-500",
      description: "Active uncollected dues across 78 students",
    },
    {
      title: "TOTAL COLLECTED",
      value: "NPR 4,320,000",
      icon: Landmark,
      iconColor: "text-emerald-500",
      hoverBar: "bg-emerald-500",
      subtext: "70.1% collection efficiency this term",
      subtextClass: "text-emerald-600 font-semibold",
    },
    {
      title: "PENDING FEES",
      value: "42 Students",
      icon: Hourglass,
      iconColor: "text-blue-500",
      hoverBar: "bg-blue-600",
      description: "Zero payments logged against schedule",
    },
    {
      title: "PARTIAL PAYMENTS",
      value: "36 Students",
      icon: PieChart,
      iconColor: "text-slate-600",
      hoverBar: "bg-slate-700",
      description: "Installment active · NPR 920k remaining",
    },
    {
      title: "FULLY PAID",
      value: "46 Students",
      icon: CheckCircle2,
      iconColor: "text-slate-900",
      hoverBar: "bg-slate-900",
      description: "Cleared with zero outstanding dues",
    },
  ];

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
            {/* Header: Title & Minimal Icon */}
            <div className="flex items-start justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 leading-tight">
                {stat.title}
              </span>
              <Icon
                className={`h-4 w-4 shrink-0 ${stat.iconColor}`}
                aria-hidden="true"
              />
            </div>

            {/* Content: Metric Value & Subtext */}
            <div className="mt-3.5">
              <p className="text-xl font-bold tracking-tight text-slate-900 xl:text-2xl">
                {stat.value}
              </p>

              <div className="mt-2 text-xs leading-relaxed text-slate-500">
                {stat.subtext ? (
                  <span className={stat.subtextClass}>{stat.subtext}</span>
                ) : (
                  <span className="text-slate-400">{stat.description}</span>
                )}
              </div>
            </div>

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
