import React from "react";
import { Calendar, ChevronDown, Download } from "lucide-react";

const ReportsHeader = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Title, Badge & Subtitle */}
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Reports
          </h1>
          <span className="bg-blue-100/70 text-blue-800 text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md">
            ANNUAL FISCAL OVERVIEW
          </span>
        </div>
        <p className="mt-1 text-sm text-slate-500 max-w-xl">
          Monitor collections, outstanding fees, payment trends, and recent
          transactions.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Date Dropdown Button */}
        <button
          type="button"
          className="flex items-center justify-between gap-3 bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl px-4 py-2.5 shadow-xs transition-all cursor-pointer text-left"
        >
          <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
          <div className="text-center text-[12px] leading-tight text-slate-800 font-medium">
            <div>This Academic Year</div>
            <div className="text-slate-500 font-normal">(2081/82)</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>

        {/* Export Button (Single-line to prevent squishing) */}
        <button
          type="button"
          className="flex items-center gap-2 bg-[#1B2537] hover:bg-[#111827] text-white px-4 py-3 rounded-xl font-medium text-xs shadow-xs transition-colors cursor-pointer whitespace-nowrap"
        >
          <Download className="w-4 h-4 shrink-0" />
          <span className="font-semibold tracking-wide">Export Report</span>
        </button>
      </div>
    </div>
  );
};

export default ReportsHeader;
