import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import { CreditCard, Wallet } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

// Custom Tooltip component for a polished hover UI
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
  // Color palette for individual bars
  const colors = ["#0284C7", "#0D9488", "#6366F1", "#8B5CF6", "#F59E0B"];

  // Skeleton loading state
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
      {/* Header */}
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

      {/* Chart Area */}
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
            <BarChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#F1F5F9"
              />

              <XAxis
                dataKey="paymentMethod"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
                dy={8}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                tickFormatter={(val) => (val >= 1000 ? `${val / 1000}k` : val)}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#F8FAFC", radius: 8 }}
              />

              <Bar
                dataKey="totalCollection"
                name="Collection"
                radius={[8, 8, 0, 0]}
                barSize={38}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodChart;
