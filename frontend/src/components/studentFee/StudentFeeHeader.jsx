import React from "react";
import { Download, Plus } from "lucide-react";

const StudentFeeHeader = () => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4 md:px-6 md:py-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left side: Title, Pill Badge, Description */}
        <div className="space-y-1.5">
          <div className="flex items-center flex-wrap gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Student Fee Ledger
            </h1>
            <span className="inline-flex items-center bg-indigo-50 text-indigo-600 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-wide">
              124 ASSIGNED FEES
            </span>
          </div>
          <p className="text-sm text-slate-500 max-w-xl">
            Track assigned fees, outstanding dues, discounts, and real-time
            payment reconciliation.
          </p>
        </div>

        {/* Right side: Export & Assign Fee Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Export Ledger CSV</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Assign Fee</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeHeader;
