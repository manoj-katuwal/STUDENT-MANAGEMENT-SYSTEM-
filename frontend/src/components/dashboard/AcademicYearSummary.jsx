import React from "react";
import { Calendar, ChevronRight } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

function AcademicYearSummary({ summaries = [] }) {
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm font-body transition-all">
      {/* Header Section */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 tracking-tight">
            Academic Year Summary
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Collection breakdown by academic year
          </p>
        </div>
        <div className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <Calendar className="h-4.5 w-4.5" />
        </div>
      </div>

      {/* Empty State */}
      {summaries.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-10 text-center">
          <p className="text-sm font-medium text-slate-500">
            No academic year data available.
          </p>
        </div>
      ) : (
        /* Table Container */
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-1 font-semibold">Academic Year</th>
                <th className="pb-3 font-semibold">Duration</th>
                <th className="pb-3 text-right pr-1 font-semibold">
                  Total Collection
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100/80 text-xs sm:text-sm">
              {summaries.map((item) => {
                const isCurrent = item.academicYear?.isCurrent;

                return (
                  <tr
                    key={item.academicYearId || item.id}
                    className="group transition-colors hover:bg-slate-50/80"
                  >
                    {/* Academic Year Name + Current Badge */}
                    <td className="py-4 pl-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">
                          {item.academicYear?.name || "-"}
                        </span>

                        {isCurrent && (
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-600 ring-1 ring-inset ring-blue-500/20">
                            Current
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date Range */}
                    <td className="py-4 font-medium text-slate-500">
                      {formatDate(item.academicYear?.startDate)} —{" "}
                      {formatDate(item.academicYear?.endDate)}
                    </td>

                    {/* Collection Amount */}
                    <td className="py-4 pr-1 text-right font-bold text-slate-900 font-mono tracking-tight text-sm sm:text-base">
                      {formatCurrency(item.totalCollection)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AcademicYearSummary;
