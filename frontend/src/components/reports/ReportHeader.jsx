import { useEffect, useRef, useState } from "react";
import { Calendar, Check, ChevronDown, Download } from "lucide-react";

const ReportsHeader = ({
  academicYear,
  academicYears = [],
  selectedAcademicYearId,
  onAcademicYearChange,
  onExport,
  isExporting = false,
  isLoading = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const selectedAcademicYear =
    academicYears.find((year) => year._id === selectedAcademicYearId) ??
    academicYear;

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!dropdownRef.current?.contains(event.target)) setIsOpen(false);
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  const selectAcademicYear = (yearId) => {
    onAcademicYearChange?.(yearId);
    setIsOpen(false);
  };

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
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            disabled={isLoading || academicYears.length === 0}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            className="flex min-w-52 items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-left shadow-xs transition-all hover:border-blue-300 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:cursor-wait disabled:opacity-70"
          >
            <Calendar className="h-4 w-4 shrink-0 text-blue-600" />
            <span className="min-w-0 flex-1 text-[12px] leading-tight">
              <span className="block font-medium text-slate-800">Academic Year</span>
              <span className="mt-0.5 block truncate text-slate-500">
                {isLoading ? "Loading academic years..." : selectedAcademicYear?.name ?? "Not configured"}
              </span>
            </span>
            <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 z-30 mt-2 w-64 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg ring-1 ring-slate-900/5">
              <p className="px-2.5 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Choose academic year
              </p>
              <div role="listbox" aria-label="Academic years" className="max-h-60 overflow-y-auto">
                {academicYears.map((year) => {
                  const isSelected = year._id === selectedAcademicYearId;
                  return (
                    <button
                      key={year._id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => selectAcademicYear(year._id)}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-2.5 py-2.5 text-left text-sm transition-colors ${isSelected ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                      <span className="font-medium">{year.name}</span>
                      <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                        {year.isCurrent && "Current"}
                        {isSelected && <Check className="h-3.5 w-3.5 text-blue-600" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Export Button (Single-line to prevent squishing) */}
        <button
          type="button"
          onClick={onExport}
          disabled={isExporting || isLoading}
          className="flex items-center gap-2 bg-[#1B2537] hover:bg-[#111827] text-white px-4 py-3 rounded-xl font-medium text-xs shadow-xs transition-colors cursor-pointer whitespace-nowrap"
        >
          <Download className={`w-4 h-4 shrink-0 ${isExporting ? "animate-bounce" : ""}`} />
          <span className="font-semibold tracking-wide">{isExporting ? "Exporting..." : "Export Report"}</span>
        </button>
      </div>
    </div>
  );
};

export default ReportsHeader;
