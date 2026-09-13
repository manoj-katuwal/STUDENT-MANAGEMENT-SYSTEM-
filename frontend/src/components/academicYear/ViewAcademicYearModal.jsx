import { useEffect } from "react";
import {
  Calendar,
  CheckCircle2,
  X,
  Clock,
  Activity,
  CalendarDays,
  Sparkles,
} from "lucide-react";
import formatDate from "../../utils/formatDate";

const ViewAcademicYearModal = ({ open, academicYear, onClose }) => {
  // ESC Key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !academicYear) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-academic-year-title"
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-950/5 transition-all animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/10">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2
                id="view-academic-year-title"
                className="text-base font-semibold text-slate-900"
              >
                Academic Year Details
              </h2>
              <p className="text-xs text-slate-500">
                View term dates, status, and session details
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close academic year details"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-4 px-6 py-5">
          {/* Main Title Hero Card */}
          <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-indigo-50/80 via-indigo-50/40 to-transparent p-4 ring-1 ring-indigo-500/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200/60">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">
                  Academic Session
                </p>
                <p className="text-lg font-bold text-slate-900">
                  {academicYear.name}
                </p>
              </div>
            </div>

            {academicYear.isCurrent && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                <Sparkles className="h-3.5 w-3.5 text-indigo-600" /> Active
                Session
              </span>
            )}
          </div>

          {/* Key Metrics Grid */}
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Start Date */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                Start Date
              </dt>
              <dd className="mt-1.5 text-sm font-semibold text-slate-800">
                {formatDate(academicYear.startDate)}
              </dd>
            </div>

            {/* End Date */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                End Date
              </dt>
              <dd className="mt-1.5 text-sm font-semibold text-slate-800">
                {formatDate(academicYear.endDate)}
              </dd>
            </div>

            {/* Status */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <Activity className="h-3.5 w-3.5 text-slate-400" />
                Operational Status
              </dt>
              <dd className="mt-1.5">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
                    academicYear.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                      : "bg-slate-100 text-slate-600 ring-1 ring-slate-200"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      academicYear.status === "ACTIVE"
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-slate-400"
                    }`}
                  />
                  {academicYear.status}
                </span>
              </dd>
            </div>

            {/* Current Year Indicator */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
              <dt className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <CheckCircle2 className="h-3.5 w-3.5 text-slate-400" />
                Current Year Flag
              </dt>
              <dd className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                {academicYear.isCurrent ? (
                  <span className="flex items-center gap-1.5 text-indigo-600">
                    <CheckCircle2 className="h-4 w-4" /> Yes (Primary)
                  </span>
                ) : (
                  <span className="text-slate-500">No</span>
                )}
              </dd>
            </div>
          </dl>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAcademicYearModal;
