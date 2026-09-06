import React from "react";
import { Search, RotateCcw } from "lucide-react";

const StudentFilters = ({
  search,
  onSearchChange,
  classId,
  onClassChange,
  classOptions = [],
  sectionId,
  onSectionChange,
  sectionOptions = [],
  onReset,
}) => {
  const selectClass =
    "px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer transition-colors";

  return (
    <div className="w-full bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4 font-sans text-slate-700">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 min-w-70">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or admission number"
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        {/* Class Dropdown */}
        <select
          value={classId}
          onChange={(e) => onClassChange(e.target.value)}
          disabled={classOptions.length === 0}
          className={selectClass}
        >
          <option value="">All Classes</option>
          {classOptions.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        {/* Section Dropdown */}
        <select
          value={sectionId}
          onChange={(e) => onSectionChange(e.target.value)}
          disabled={!classId || sectionOptions.length === 0}
          className={selectClass}
        >
          <option value="">All Sections</option>
          {sectionOptions.map((sec) => (
            <option key={sec._id} value={sec._id}>
              {sec.name}
            </option>
          ))}
        </select>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
};

export default StudentFilters;
