import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { CreditCard, Wallet } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-xl ring-1 ring-slate-900/5">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {data.paymentMethod}
        </p>
        <p className="mt-1 text-lg font-bold text-slate-900">
          {formatCurrency(data.totalCollection ?? 0)}
        </p>
        {data.count !== undefined && (
          <p className="mt-0.5 text-xs font-medium text-slate-500">
            {data.count} transactions
          </p>
        )}
      </div>
    );
  }
  return null;
};

const PaymentMethodChart = ({ data = [], isLoading = false }) => {
  const colors = ["#0284C7", "#0D9488", "#6366F1", "#8B5CF6", "#F59E0B"];
  const totalCollection = data.reduce(
    (total, item) => total + Number(item.totalCollection ?? 0),
    0,
  );

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs animate-pulse">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-2">
            <div className="h-5 w-48 rounded bg-slate-200" />
            <div className="h-3.5 w-64 rounded bg-slate-100" />
          </div>
          <div className="h-10 w-10 rounded-xl bg-slate-100" />
        </div>
        <div className="h-72 w-full rounded-xl bg-slate-100" />
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all duration-200 hover:shadow-md">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Collection by Payment Method
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Breakdown of revenue collected across different channels
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Wallet className="h-5 w-5 stroke-2" />
        </div>
      </div>

      <div className="h-72 w-full">
        {data.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <CreditCard className="h-8 w-8 text-slate-300" />
            <p className="mt-2 text-xs font-medium text-slate-400">
              No payment collection data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={<CustomTooltip />}
              />
              <Pie
                dataKey="totalCollection"
                data={data}
                nameKey="paymentMethod"
                cx="50%"
                cy="50%"
                innerRadius="58%"
                outerRadius="82%"
                paddingAngle={3}
                stroke="none"
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
              <text
                x="50%"
                y="47%"
                textAnchor="middle"
                className="fill-slate-400 text-xs font-medium"
              >
                Total collection
              </text>
              <text
                x="50%"
                y="56%"
                textAnchor="middle"
                className="fill-slate-900 text-sm font-bold"
              >
                {formatCurrency(totalCollection)}
              </text>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      {data.length > 0 && (
        <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-slate-100 pt-4 sm:grid-cols-3">
          {data.map((item, index) => (
            <div key={item.paymentMethod} className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="truncate text-xs font-medium text-slate-600">
                {item.paymentMethod}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentMethodChart;
