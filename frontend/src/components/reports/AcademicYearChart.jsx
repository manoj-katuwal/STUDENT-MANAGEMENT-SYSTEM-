import React from "react";
import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const AcademicYearChart = ({ data = [] }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-900">
          Collection by Academic Year
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Collection breakdown by academic year.
        </p>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="academicYear.name"
              axisLine={false}
              tickLine={false}
            />

            <YAxis axisLine={false} tickLine={false} />

            <Tooltip />

            <Bar
              dataKey="totalCollection"
              name="Collection"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AcademicYearChart;
