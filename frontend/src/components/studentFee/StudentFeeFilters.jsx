import { Search, RotateCcw, Filter } from "lucide-react";

const StudentFeeFilters = ({
  filters = {},
  academicYears = [],
  feeStructures = [],
  onFilterChange,
  onClear,
}) => {
  const hasActiveFilters =
    filters.search ||
    filters.academicYearId ||
    filters.feeStructureId ||
    filters.status;

  const handleFilterChange = (key, value) => {
    onFilterChange?.(key, value);
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all">
      {/* Optional Header inside Filter section */}
      <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-500" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Filter Fee Ledgers
          </h3>
        </div>
        <button
          type="button"
          onClick={onClear}
          disabled={!hasActiveFilters}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <RotateCcw className="h-3.5 w-3.5 text-slate-400 group-hover:rotate-180 transition-transform" />
          Reset Filters
        </button>
      </div>

      {/* Grid Filters */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Student Search Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Student
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name, roll no..."
              value={filters.search || ""}
              onChange={(event) =>
                handleFilterChange("search", event.target.value)
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Academic Year Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Academic Year
          </label>
          <select
            value={filters.academicYearId || ""}
            onChange={(event) =>
              handleFilterChange("academicYearId", event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            <option value="">All academic years</option>
            {academicYears.map((academicYear) => (
              <option key={academicYear._id} value={academicYear._id}>
                {academicYear.name}
              </option>
            ))}
          </select>
        </div>

        {/* Fee Structure Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Fee Structure
          </label>
          <select
            value={filters.feeStructureId || ""}
            onChange={(event) =>
              handleFilterChange("feeStructureId", event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            <option value="">All fee structures</option>
            {feeStructures.map((feeStructure) => (
              <option key={feeStructure._id} value={feeStructure._id}>
                {feeStructure.name || feeStructure.feeType}
              </option>
            ))}
          </select>
        </div>

        {/* Status Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Status
          </label>
          <select
            value={filters.status || ""}
            onChange={(event) =>
              handleFilterChange("status", event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            <option value="">All statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeFilters;
