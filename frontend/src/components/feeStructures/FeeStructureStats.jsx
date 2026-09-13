import React from "react";
import {
  Layers,
  CheckCircle2,
  GraduationCap,
  Bus,
  Sliders,
} from "lucide-react";

const FeeStructureStats = ({ stats, isLoading = false }) => {
  // Static placeholder data based on the design
  const total = stats?.total ?? 0;
  const active = stats?.active ?? 0;
  const tuition = stats?.tuition ?? 0;
  const auxiliary = stats?.auxiliary ?? 0;

  const statCards = [
    {
      label: "TOTAL FEE STRUCTURES",
      value: isLoading ? "—" : total,
      icon: Layers,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      hoverBar: "bg-blue-500",
      footer: (
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-semibold text-blue-600">
            <Sliders className="h-3.5 w-3.5" />
            Configured
          </span>
          <span>Across 12 grade tiers</span>
        </div>
      ),
    },
    {
      label: "ACTIVE IN EFFECT",
      value: isLoading ? "—" : active,
      icon: CheckCircle2,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      hoverBar: "bg-emerald-500",
      footer: (
        <div className="space-y-1.5 w-full">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-500">87.5% in effect</span>
            <span className="font-bold text-slate-900">3 Inactive</span>
          </div>
          {/* Progress Bar */}
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: "87.5%" }}
            />
          </div>
        </div>
      ),
    },
    {
      label: "TUITION FEES",
      value: (
        <div className="flex items-baseline gap-2">
          <span>{isLoading ? "—" : tuition}</span>
          <span className="text-base font-medium text-slate-500">Classes</span>
        </div>
      ),
      icon: GraduationCap,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      hoverBar: "bg-blue-500",
      footer: (
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">Average Base Rate</span>
          <span className="font-bold text-slate-900">NPR 24,500/yr</span>
        </div>
      ),
    },
    {
      label: "AUXILIARY FEES",
      value: (
        <div className="flex items-baseline gap-2">
          <span>{isLoading ? "—" : auxiliary}</span>
          <span className="text-base font-medium text-slate-500">Rules</span>
        </div>
      ),
      icon: Bus,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      hoverBar: "bg-blue-500",
      footer: (
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1 text-blue-600">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />8 Transport
          </span>
          <span className="flex items-center gap-1 text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />6 Exam
          </span>
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
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold tracking-wider text-slate-500">
                    {label}
                  </p>
                  <div className="mt-2 text-3xl font-extrabold text-slate-900">
                    {value}
                  </div>
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

export default FeeStructureStats;
