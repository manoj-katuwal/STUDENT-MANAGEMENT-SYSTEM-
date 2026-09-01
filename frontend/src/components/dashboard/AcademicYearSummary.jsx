import React from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowUpRight } from "lucide-react";
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

  // Limit to 5 academic year records on dashboard overview
  const displayedSummaries = summaries.slice(0, 5);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs h-full">
      <div>
        {/* Header Section */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-poppins text-base sm:text-lg font-semibold text-slate-900 tracking-tight">
              Academic Year Summary
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Collection breakdown by academic year
            </p>
          </div>
          {summaries.length > 0 && (
            <Link
              to="/reports"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              View Reports
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
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
                {displayedSummaries.map((item) => {
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
                      <td className="py-4 pr-1 text-right font-bold text-slate-900 font-poppins tracking-tight text-sm sm:text-base">
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

      {/* Footer */}
      {summaries.length > 5 && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 5 of {summaries.length} academic years</span>
          <Link
            to="/reports"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            View all reports →
          </Link>
        </div>
      )}
    </div>
  );
}

export default AcademicYearSummary;
