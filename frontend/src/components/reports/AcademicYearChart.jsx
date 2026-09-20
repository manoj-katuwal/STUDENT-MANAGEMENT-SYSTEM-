import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalendarDays, GraduationCap } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;

  const item = payload[0].payload;
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3 shadow-xl ring-1 ring-slate-900/5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {item.academicYear?.name}
      </p>
      <p className="mt-1 text-lg font-bold text-slate-900">
        {formatCurrency(item.totalCollection ?? 0)}
      </p>
    </div>
  );
};

const AcademicYearChart = ({ data = [], isLoading = false }) => {
  if (isLoading) {
    return <div className="h-[25.5rem] animate-pulse rounded-2xl border border-slate-100 bg-slate-100" />;
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all duration-200 hover:shadow-md">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900">
          Collection by Academic Year
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Revenue trend across academic sessions
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <CalendarDays className="h-5 w-5 stroke-2" />
        </div>
      </div>

      <div className="h-72 w-full">
        {data.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50">
            <GraduationCap className="h-8 w-8 text-slate-300" />
            <p className="mt-2 text-xs font-medium text-slate-400">
              No academic year collection data available
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />

              <XAxis dataKey="academicYear.name" axisLine={false} tickLine={false} tick={{ fill: "#64748B", fontSize: 12, fontWeight: 500 }} dy={8} />

              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : value)} />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#F8FAFC" }} />

              <Bar dataKey="totalCollection" name="Collection" fill="#6366F1" radius={[8, 8, 0, 0]} barSize={36} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default AcademicYearChart;
