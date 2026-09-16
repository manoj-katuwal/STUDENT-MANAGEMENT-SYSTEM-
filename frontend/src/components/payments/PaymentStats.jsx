import {
  CreditCard,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Receipt,
  Info,
  RefreshCw,
} from "lucide-react";
import { usePaymentStats } from "../../features/payments/payment.hooks";
import { formatCurrency } from "../../utils/formatCurrency";

const PaymentStats = () => {
  const {
    data: stats,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = usePaymentStats();

  const successfulPayments = stats?.successfulPayments ?? 0;
  const failedPayments = stats?.failedPayments ?? 0;
  const completedPayments = successfulPayments + failedPayments;
  const successRate =
    completedPayments > 0
      ? ((successfulPayments / completedPayments) * 100).toFixed(1)
      : "0.0";

  // Error handle गर्ने भाग
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/50 p-6 text-center">
        <AlertCircle className="h-8 w-8 text-rose-500 mb-2" />
        <p className="text-sm font-semibold text-rose-900">
          स्ट्याट्स डाटा लोड गर्न सकिएन।
        </p>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="mt-3 flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-rose-700 disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`}
          />
          पुन: प्रयास गर्नुहोस् (Retry)
        </button>
      </div>
    );
  }

  // Skeleton Loading State
  if (isLoading) {
    return (
      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Payment Statistics Loading"
      >
        {[...Array(4)].map((_, idx) => (
          <div
            key={idx}
            className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-xs animate-pulse"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="h-3 w-24 rounded bg-slate-200" />
              <div className="h-11 w-11 rounded-2xl bg-slate-200" />
            </div>
            <div className="mt-3">
              <div className="h-8 w-32 rounded bg-slate-200" />
              <div className="mt-4 flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-slate-200" />
                <div className="h-3 w-40 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </section>
    );
  }

  const statCards = [
    {
      title: "Total Collected",
      value: formatCurrency(stats?.totalCollected),
      icon: CreditCard,
      bg: "bg-blue-50/80 text-blue-600",
      hoverBar: "bg-blue-500",
      subtext: `${formatCurrency(stats?.thisMonth)} collected this month`,
      subtextClass: "text-slate-500 font-medium",
      showTrend: true,
    },
    {
      title: "Today's Collection",
      value: formatCurrency(stats?.todayCollection),
      icon: Receipt,
      bg: "bg-indigo-50/80 text-indigo-600",
      hoverBar: "bg-indigo-500",
      subtext: `${stats?.todayTransactions ?? 0} transactions logged today`,
      subtextClass: "text-slate-500 font-medium",
      showClockIcon: true,
    },
    {
      title: "Successful Payments",
      value: `${successfulPayments} Payments`,
      icon: CheckCircle2,
      bg: "bg-emerald-50/80 text-emerald-500",
      hoverBar: "bg-emerald-500",
      subtext: `${successRate}% Success rate`,
      subtextClass: "text-slate-500 font-medium",
      showProgress: true,
      progressWidth: `${successRate}%`,
    },
    {
      title: "Pending & Verification",
      value: `${stats?.pendingPayments ?? 0} Payments`,
      icon: AlertCircle,
      bg: "bg-amber-50/80 text-amber-600",
      hoverBar: "bg-amber-500",
      subtext: `${formatCurrency(stats?.pendingAmount)} awaiting verification`,
      subtextClass: "text-amber-700 font-medium",
      showInfoIcon: true,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Refetch / Refresh Indicator (Optional header UI) */}
      <div className="flex justify-end">
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          title="Refresh statistics"
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? "animate-spin text-blue-600" : ""}`}
          />
          {isFetching ? "रिफ्रेस हुँदैछ..." : "रिफ्रेस"}
        </button>
      </div>

      <section
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        aria-label="Payment Statistics"
      >
        {statCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              {/* Top Row: Title & Icon Badge */}
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
                <p className="text-2xl font-extrabold tracking-tight text-slate-900 xl:text-3xl">
                  {stat.value}
                </p>

                {/* Bottom Info Line */}
                <div className="mt-4 flex items-center gap-1.5 text-xs">
                  {stat.showTrend && (
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  )}
                  {stat.showInfoIcon && (
                    <Info className="h-3.5 w-3.5 text-amber-500" />
                  )}
                  {stat.showClockIcon && (
                    <Clock className="h-3.5 w-3.5 text-indigo-500" />
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
    </div>
  );
};

export default PaymentStats;
