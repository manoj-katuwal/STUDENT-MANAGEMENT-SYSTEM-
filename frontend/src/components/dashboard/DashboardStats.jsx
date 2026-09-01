import { Banknote, CalendarDays, WalletCards, CircleAlert } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

const DashboardStats = ({ data }) => {
  const stats = [
    {
      title: "Today's Collection",
      value: data?.todayCollection?.totalCollection,
      icon: Banknote,
      accent: "emerald",
      bg: "bg-emerald-50 text-emerald-600 ring-emerald-200/60",
      hoverBar: "bg-emerald-500",
      description: "Collection recorded today",
    },
    {
      title: "Monthly Collection",
      value: data?.monthlyCollection?.totalCollection,
      icon: CalendarDays,
      accent: "blue",
      bg: "bg-blue-50 text-blue-600 ring-blue-200/60",
      hoverBar: "bg-blue-500",
      description: "Total collection this month",
    },
    {
      title: "Pending Fees",
      value: data?.pendingFee?.totalPending,
      icon: WalletCards,
      accent: "amber",
      bg: "bg-amber-50 text-amber-600 ring-amber-200/60",
      hoverBar: "bg-amber-500",
      description: "Fees due for collection",
    },
    {
      title: "Overdue Fees",
      value: data?.overdueFee?.totalOverdue,
      icon: CircleAlert,
      accent: "rose",
      bg: "bg-rose-50 text-rose-600 ring-rose-200/60",
      hoverBar: "bg-rose-500",
      description: "Fees past due date",
    },
  ];

  return (
    <section
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Financial overview"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.title}
            className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md  focus-visible:outline-2 focus-visible:outline-blue-500"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-poppins">
                {stat.title}
              </span>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 transition-transform duration-200 group-hover:scale-105 ${stat.bg}`}
              >
                <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-3">
              <p className="font-poppins text-xl font-bold tracking-tight text-slate-900 lg:text-2xl">
                {formatCurrency(stat.value)}
              </p>
              <p className="mt-1 text-xs text-slate-400">{stat.description}</p>
            </div>

            <div
              className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${stat.hoverBar}`}
            />
          </div>
        );
      })}
    </section>
  );
};

export default DashboardStats;
