import { Calendar, CheckCircle2, X } from "lucide-react";
import formatDate from "../../utils/formatDate";

const ViewAcademicYearModal = ({ open, academicYear, onClose }) => {
  if (!open || !academicYear) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-academic-year-title"
        className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2
              id="view-academic-year-title"
              className="text-lg font-semibold text-slate-900"
            >
              Academic Year Details
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View academic period information.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close academic year details"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex items-center gap-3 rounded-xl bg-indigo-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-indigo-600">
                Academic Year
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {academicYear.name}
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-4">
              <dt className="text-xs font-medium text-slate-500">Start Date</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-800">
                {formatDate(academicYear.startDate)}
              </dd>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <dt className="text-xs font-medium text-slate-500">End Date</dt>
              <dd className="mt-1 text-sm font-semibold text-slate-800">
                {formatDate(academicYear.endDate)}
              </dd>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <dt className="text-xs font-medium text-slate-500">Status</dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                    academicYear.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {academicYear.status}
                </span>
              </dd>
            </div>
            <div className="rounded-xl border border-slate-200 p-4">
              <dt className="text-xs font-medium text-slate-500">Current Year</dt>
              <dd className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                {academicYear.isCurrent ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-blue-600" /> Current
                  </>
                ) : (
                  "No"
                )}
              </dd>
            </div>
          </dl>
        </div>

        <div className="flex justify-end border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAcademicYearModal;
