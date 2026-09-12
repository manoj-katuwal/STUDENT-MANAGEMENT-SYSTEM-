import {
  CalendarDays,
  History,
  CheckCircle2,
  Info,
  TrendingUp,
} from "lucide-react";

const AcademicYearStats = ({ stats }) => {
  const currentAcademicYear = stats?.currentAcademicYear ?? "No current year";
  const totalAcademicYears = stats?.totalAcademicYears ?? 0;
  const activeAcademicYears = stats?.activeAcademicYears ?? 0;

  const statCards = [
    {
      label: "CURRENT ACADEMIC YEAR",
      value: currentAcademicYear,
      icon: CalendarDays,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      hoverBar: "bg-blue-500",
      footer: (
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
            Current
          </span>
          <span className="text-slate-500">Active academic period</span>
        </div>
      ),
    },
    {
      label: "TOTAL ACADEMIC YEARS",
      value: totalAcademicYears,
      icon: History,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
      hoverBar: "bg-indigo-500",
      footer: (
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <Info className="h-3.5 w-3.5 text-slate-400" />
          <span>All recorded academic years</span>
        </div>
      ),
    },
    {
      label: "ACTIVE YEARS",
      value: activeAcademicYears,
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
      hoverBar: "bg-emerald-500",
      footer: (
        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <TrendingUp className="h-3.5 w-3.5" />
          <span>Currently available for selection</span>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

export default AcademicYearStats;
