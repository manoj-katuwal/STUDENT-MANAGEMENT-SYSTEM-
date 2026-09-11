import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useUpdateAcademicYear } from "../../features/academicYear/academicYear.hooks";
const EditAcademicYearModal = ({ open, academicYear, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
  });
  const updateMutation = useUpdateAcademicYear();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!academicYear) return;

    setFormData({
      name: academicYear.name ?? "",
      startDate: academicYear.startDate
        ? academicYear.startDate.slice(0, 10)
        : "",
      endDate: academicYear.endDate ? academicYear.endDate.slice(0, 10) : "",
      isCurrent: academicYear.isCurrent ?? false,
    });
  }, [academicYear]);
  if (!open || !academicYear) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!formData.name.trim()) {
      setError("Academic year name is required.");
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      setError("Start date and end date are required.");
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      setError("Start date must be before end date.");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Edit Academic Year
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Update academic year details
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form className="space-y-4 p-6" onSubmit={handleSubmit}>
          {error && (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              {error}
            </p>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Academic Year
            </label>

            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Start Date
              </label>

              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    startDate: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                End Date
              </label>

              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    endDate: e.target.value,
                  }))
                }
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
            <input
              type="checkbox"
              checked={formData.isCurrent}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isCurrent: e.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-slate-300 text-blue-600"
            />

            <span className="text-sm font-medium text-slate-700">
              Set as current academic year
            </span>
          </label>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAcademicYearModal;
