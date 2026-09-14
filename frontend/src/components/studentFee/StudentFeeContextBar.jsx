import React from "react";
import { ChevronRight, ShieldCheck } from "lucide-react";

const StudentFeeContextBar = ({ currentAcademicYear, isLoading }) => {
  const academicYearName = isLoading
    ? "Loading academic year..."
    : currentAcademicYear?.name || "No current academic year";

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
      {/* Left side: Breadcrumb navigation (StudentContextBar ko style ma) */}
      <div className="flex items-center space-x-1.5 text-slate-500">
        <span className="font-medium">Academic Year {academicYearName}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold">Student Fees</span>
      </div>

      {/* Right side: Original StudentFeeContextBar badges */}
      <div className="flex items-center space-x-2">
        {/* Database Status Pill */}
        <div className="flex items-center gap-1.5 bg-[#eef4ff] text-[#1e40af] px-3 py-1 rounded-full font-semibold text-[11px] tracking-wide uppercase">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
          <span>DATABASE SYNCED · 2 MIN AGO</span>
        </div>

        {/* Ledger Enforced Pill */}
        <div className="flex items-center gap-1.5 bg-[#dbeefd] text-[#1e40af] px-3 py-1 rounded-full font-semibold text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>
            Ledger Enforced ·{" "}
            <strong className="font-bold">Real-Time Balance</strong>
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeContextBar;
