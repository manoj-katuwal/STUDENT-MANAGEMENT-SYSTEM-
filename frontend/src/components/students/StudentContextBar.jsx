import { ChevronRight } from "lucide-react";

const StudentContextBar = () => {
  return (
    <div className="flex items-center justify-between py-3 px-1 text-sm">
      {/* Left side: Breadcrumb navigation */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-500 font-medium">Academic Year 2081/82</span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
        <span className="text-slate-800 font-bold">Student Directory</span>
      </div>

      {/* Right side: Database sync badge */}
      <div className="flex items-center space-x-2 bg-blue-50/60 px-3 py-1 rounded-full border border-blue-100/50">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-[11px] font-semibold text-slate-600 tracking-wider uppercase">
          Database Synced 2 Min Ago
        </span>
      </div>
    </div>
  );
};

export default StudentContextBar;
