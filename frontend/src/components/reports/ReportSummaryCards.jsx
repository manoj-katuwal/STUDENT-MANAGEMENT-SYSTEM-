import React from "react";
import {
  Banknote,
  CalendarCheck,
  ClipboardClock,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

const ReportSummaryCards = () => {
  const cards = [
    {
      title: "TODAY'S COLLECTION",
      value: "Rs. 24,500",
      valueColor: "text-slate-900",
      icon: Banknote,
      iconBg: "bg-[#064E3B] text-emerald-400", 
      hoverBar: "bg-emerald-600",
      subtext: "Collected\ntoday",
      pill: {
        text: "+12.4% vs yesterday",
        icon: TrendingUp,
        bg: "bg-blue-50 text-emerald-600",
      },
    },
    {
      title: "MONTHLY COLLECTION",
      value: "Rs. 482,750",
      valueColor: "text-slate-900",
      icon: CalendarCheck,
      iconBg: "bg-blue-100/80 text-blue-600",
      hoverBar: "bg-blue-500",
      subtext: "Collected this\nmonth",
      pill: {
        text: "Bhadra 2081 intake",
        bg: "bg-blue-100/70 text-slate-800 font-semibold",
      },
    },
    {
      title: "PENDING FEES",
      value: "Rs. 185,400",
      valueColor: "text-slate-900",
      icon: ClipboardClock,
      iconBg: "bg-blue-100/80 text-blue-600",
      hoverBar: "bg-amber-500",
      subtext: "Outstanding\nbalance",
      pill: {
        text: "78 students with dues",
        bg: "bg-blue-50 text-slate-700 font-medium",
      },
    },
    {
      title: "OVERDUE FEES",
      value: "Rs. 72,500",
      valueColor: "text-[#B91C1C]", // Red text
      icon: AlertCircle,
      iconBg: "bg-rose-100/80 text-rose-600",
      hoverBar: "bg-rose-500",
      subtext: "Past due\namount",
      pill: {
        text: "Action required",
        bg: "bg-rose-100/80 text-rose-700 font-semibold",
      },
    },
  ];

  return (
    <section
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
      aria-label="Report Summary Cards"
    >
      {cards.map((card) => {
        const Icon = card.icon;
        const PillIcon = card.pill?.icon;

        return (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col justify-between"
          >
            {/* Top Row: Title & Icon Badge */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <div
                  className={`flex shrink-0 items-center justify-center rounded-xl p-2.5 transition-transform duration-200 group-hover:scale-105 ${card.iconBg}`}
                >
                  <Icon className="h-5 w-5 stroke-[2]" aria-hidden="true" />
                </div>
              </div>

              {/* Middle Row: Big Value */}
              <div className="mt-1">
                <p
                  className={`text-2xl font-bold tracking-tight xl:text-3xl ${card.valueColor}`}
                >
                  {card.value}
                </p>
              </div>
            </div>

            {/* Bottom Row: Subtext & Pill Badge */}
            <div className="mt-5 flex items-center justify-between gap-2 text-xs">
              <span className="text-slate-500 font-medium leading-tight whitespace-pre-line">
                {card.subtext}
              </span>

              {card.pill && (
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] shrink-0 ${card.pill.bg}`}
                >
                  {PillIcon && <PillIcon className="h-3 w-3 shrink-0" />}
                  <span>{card.pill.text}</span>
                </div>
              )}
            </div>

            {/* Bottom Accent Hover Line */}
            <div
              className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${card.hoverBar}`}
            />
          </div>
        );
      })}
    </section>
  );
};

export default ReportSummaryCards;
