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
import { CalendarDays, GraduationCap } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "../../utils/formatCurrency";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;
  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/95 p-3.5 shadow-xl backdrop-blur-md">
      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {item.academicYear?.name}
      </p>
      <p className="mt-1 text-base font-extrabold text-slate-900">
        {formatCurrency(item.totalCollection ?? 0)}
      </p>
    </div>
  );
};

const AcademicYearChart = ({ data = [], isLoading = false }) => {
  const [focusIndex, setFocusIndex] = useState(null);

  if (isLoading) {
    return (
      <div className="h-95 w-full animate-pulse rounded-2xl border border-slate-100 bg-slate-50/50 p-6">
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
      {/* Card Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Collection by Academic Year
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Revenue trend across academic sessions
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50/80 text-indigo-600 ring-1 ring-indigo-500/10">
          <CalendarDays className="h-5 w-5 stroke-[2.2]" />
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full">
        {data.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-6 text-center">
            <div className="rounded-full bg-slate-100 p-3">
              <GraduationCap className="h-6 w-6 text-slate-400" />
            </div>
            <p className="mt-3 text-xs font-semibold text-slate-600">
              No collection data found
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Academic year records will appear here once transactions are
              recorded.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 12, right: 8, left: -18, bottom: 0 }}
              onMouseLeave={() => setFocusIndex(null)}
            >
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" stopOpacity={1} />
                  <stop offset="100%" stopColor="#4F46E5" stopOpacity={0.8} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="4 4"
                stroke="#E2E8F0"
                strokeOpacity={0.6}
              />

              <XAxis
                dataKey="academicYear.name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94A3B8", fontSize: 11 }}
                tickFormatter={(val) =>
                  val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val
                }
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#F1F5F9", opacity: 0.5 }}
              />

              <Bar
                dataKey="totalCollection"
                radius={[8, 8, 0, 0]}
                barSize={32}
                onMouseEnter={(_, index) => setFocusIndex(index)}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill="url(#barGradient)"
                    opacity={
                      focusIndex === null || focusIndex === index ? 1 : 0.45
                    }
                    className="transition-all duration-200 cursor-pointer"
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

export default AcademicYearChart;
