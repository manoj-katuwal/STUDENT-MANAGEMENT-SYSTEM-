import { ChevronRight } from "lucide-react";

const StudentContextBar = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
      {/* Left side: Breadcrumb navigation */}
      <div className="flex items-center space-x-1.5 text-slate-500">
        <span className="font-medium">Academic Year 2081/82</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-800 font-semibold">Student Directory</span>
      </div>

      {/* Right side: Database sync badge */}
      <div className="flex items-center space-x-2 bg-blue-50/70 px-2.5 py-0.5 rounded-full border border-blue-100/60">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
        <span className="text-[10.5px] font-semibold text-slate-600 tracking-wider uppercase">
          Database Synced Just Now
        </span>
      </div>
    </div>
  );
};

export default StudentContextBar;
