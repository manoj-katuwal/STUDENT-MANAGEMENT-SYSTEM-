import React from "react";
import { Search, Filter, RotateCcw, X } from "lucide-react";

const FeeStructureFilters = ({
  filters = {},
  academicYears = [],
  classes = [],
  onFilterChange,
  onClear,
  resultCount,
}) => {
  // Check if any filter is active to show the clear button dynamically
  const hasActiveFilters =
    filters.search ||
    filters.academicYearId ||
    filters.classId ||
    filters.feeType ||
    filters.status;

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
      {/* Search & Select Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {/* Search Input (Optional Search support) */}
        <div className="relative sm:col-span-2 lg:col-span-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search fee structure..."
            value={filters.search || ""}
            onChange={(e) => onFilterChange("search", e.target.value)}
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-sm text-slate-800 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        {/* Academic Year Dropdown */}
        <select
          value={filters.academicYearId || ""}
          onChange={(e) => onFilterChange("academicYearId", e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
        >
          <option value="">All Academic Years</option>
          {academicYears.map((academicYear) => (
            <option key={academicYear._id} value={academicYear._id}>
              {academicYear.name}
            </option>
          ))}
        </select>

        {/* Class Dropdown */}
        <select
          value={filters.classId || ""}
          onChange={(e) => onFilterChange("classId", e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
        >
          <option value="">All Classes</option>
          {classes.map((classRecord) => (
            <option key={classRecord._id} value={classRecord._id}>
              {classRecord.name}
              {classRecord.code ? ` (${classRecord.code})` : ""}
            </option>
          ))}
        </select>

        {/* Fee Type Dropdown */}
        <select
          value={filters.feeType || ""}
          onChange={(e) => onFilterChange("feeType", e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
        >
          <option value="">All Fee Types</option>
          <option value="TUITION">Tuition</option>
          <option value="TRANSPORT">Transport</option>
          <option value="EXAM">Examination</option>
        </select>

        {/* Status Dropdown */}
        <select
          value={filters.status || ""}
          onChange={(e) => onFilterChange("status", e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
        >
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {/* Bottom Bar: Results counter & Clear Filters */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-medium text-slate-600">
            {resultCount === undefined ? (
              <span className="animate-pulse">Loading fee structures...</span>
            ) : (
              <>
                Found{" "}
                <span className="font-bold text-slate-900">{resultCount}</span>{" "}
                fee structure{resultCount === 1 ? "" : "s"}
              </>
            )}
          </span>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FeeStructureFilters;
