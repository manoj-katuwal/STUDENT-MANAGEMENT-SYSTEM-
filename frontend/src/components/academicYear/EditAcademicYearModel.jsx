import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  CalendarDays,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useUpdateAcademicYear } from "../../features/academicYear/academicYear.hooks";

const getInitialFormData = (academicYear) => ({
  name: academicYear?.name ?? "",
  startDate: academicYear?.startDate ? academicYear.startDate.slice(0, 10) : "",
  endDate: academicYear?.endDate ? academicYear.endDate.slice(0, 10) : "",
  isCurrent: academicYear?.isCurrent ?? false,
});

const EditAcademicYearModal = ({ open, academicYear, onClose }) => {
  const [formData, setFormData] = useState(() =>
    getInitialFormData(academicYear),
  );
  const [error, setError] = useState("");
  const updateMutation = useUpdateAcademicYear();

  // Sync state when selected academic year changes
  useEffect(() => {
    if (academicYear) {
      setFormData(getInitialFormData(academicYear));
      setError("");
    }
  }, [academicYear]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !academicYear) return null;

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Academic year name is required.");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError("Both start date and end date are required.");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError("Start date must be earlier than the end date.");
      return;
    }

    updateMutation.mutate(
      {
        academicYearId: academicYear._id,
        academicYearData: { ...formData, name: formData.name.trim() },
      },
      {
        onSuccess: () => {
          onClose();
        },
        onError: (requestError) => {
          setError(
            requestError?.response?.data?.message ||
              "Failed to update academic year.",
          );
        },
      },
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-950/5 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/10">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Edit Academic Year
              </h2>
              <p className="text-xs text-slate-500">
                Update term dates and status configuration
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-5">
            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-red-200/80 bg-red-50/50 p-3.5 text-xs text-red-700 animate-in fade-in duration-150"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Academic Year Name */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700">
                <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                Academic Year Title
              </label>
              <input
                type="text"
                placeholder="e.g. 2081/2082 or 2026-2027"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Date Pickers */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  max={formData.endDate || undefined}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      startDate: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium text-slate-700">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  min={formData.startDate || undefined}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      endDate: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Is Current Checkbox Card */}
            <label className="group flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 transition-all hover:bg-slate-50 hover:border-slate-300">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.isCurrent}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isCurrent: e.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                />
                <div>
                  <span className="block text-xs font-semibold text-slate-800">
                    Set as Current Active Session
                  </span>
                  <span className="block text-[11px] text-slate-500">
                    Mark this year as the active operational year across the
                    platform
                  </span>
                </div>
              </div>
              {formData.isCurrent && (
                <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0" />
              )}
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:pointer-events-none"
            >
              {updateMutation.isPending && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAcademicYearModal;
