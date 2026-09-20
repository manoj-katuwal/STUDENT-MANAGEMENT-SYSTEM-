import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CreditCard, Wallet } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

const CHART_COLORS = ["#0284C7", "#0D9488", "#6366F1", "#8B5CF6", "#F59E0B"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const data = payload[0].payload;
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/95 p-3.5 shadow-xl backdrop-blur-md">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {data.paymentMethod}
      </p>
      <p className="mt-1 text-base font-extrabold text-slate-900">
        {formatCurrency(data.totalCollection ?? 0)}
      </p>
      {data.count !== undefined && (
        <p className="mt-0.5 text-xs font-medium text-slate-500">
          {data.count} transactions
        </p>
      )}
    </div>
  );
};

const PaymentMethodChart = ({ data = [], isLoading = false }) => {
  const totalCollection = data.reduce(
    (total, item) => total + Number(item.totalCollection ?? 0),
    0,
  );

  if (isLoading) {
    return (
      <div className="h-[380px] w-full animate-pulse rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-48 rounded-lg bg-slate-200" />
            <div className="h-3.5 w-64 rounded-lg bg-slate-100" />
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-200" />
        </div>
        <div className="mt-8 h-60 w-full rounded-xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Header Section */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Collection by Payment Method
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Breakdown of revenue collected across different channels
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50/80 text-sky-600 ring-1 ring-sky-500/10">
          <Wallet className="h-5 w-5 stroke-[2.2]" />
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 w-full">
        {data.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
            <div className="rounded-full bg-slate-100 p-3">
              <CreditCard className="h-6 w-6 text-slate-400" />
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-600">
              No payment collection data
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Payment method analytics will be displayed here once available.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                dataKey="totalCollection"
                nameKey="paymentMethod"
                cx="50%"
                cy="50%"
                innerRadius="62%"
                outerRadius="85%"
                paddingAngle={4}
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                    className="cursor-pointer transition-opacity duration-200 hover:opacity-80"
                  />
                ))}
              </Pie>
              {/* Center Summary */}
              <text
                x="50%"
                y="45%"
                textAnchor="middle"
                className="fill-slate-400 text-[11px] font-semibold uppercase tracking-wider"
              >
                Total
              </text>
              <text
                x="50%"
                y="57%"
                textAnchor="middle"
                className="fill-slate-900 text-lg font-extrabold"
              >
                {formatCurrency(totalCollection)}
              </text>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Enhanced Custom Legend */}
      {data.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-2 border-t border-slate-100 pt-4 sm:grid-cols-2">
          {data.map((item, index) => {
            const amount = Number(item.totalCollection ?? 0);
            const percentage =
              totalCollection > 0
                ? ((amount / totalCollection) * 100).toFixed(1)
                : 0;

            return (
              <div
                key={item.paymentMethod}
                className="flex items-center justify-between rounded-lg p-1.5 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{
                      backgroundColor:
                        CHART_COLORS[index % CHART_COLORS.length],
                    }}
                  />
                  <span className="truncate text-xs font-semibold text-slate-700">
                    {item.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-bold text-slate-900">
                    {formatCurrency(amount)}
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">
                    ({percentage}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodChart;
