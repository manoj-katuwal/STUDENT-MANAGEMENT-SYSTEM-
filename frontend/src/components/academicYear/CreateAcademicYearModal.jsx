import { useState } from "react";
import { X } from "lucide-react";
import { useCreateAcademicYear } from "../../features/academicYear/academicYear.hooks";

const CreateAcademicYearModal = ({ open, onClose }) => {
  const createAcademicYearMutation = useCreateAcademicYear();
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    isCurrent: false,
  });
  const [error, setError] = useState("");

  if (!open) return null;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

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

    createAcademicYearMutation.mutate(
      {
        ...formData,
        name: formData.name.trim(),
      },
      {
      onSuccess: () => {
        setFormData({
          name: "",
          startDate: "",
          endDate: "",
          isCurrent: false,
        });

        onClose();
      },
        onError: (error) => {
          setError(
            error?.response?.data?.message || "Failed to create academic year.",
          );
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Add Academic Year
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              Create a new academic period
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

        <form onSubmit={handleSubmit}>
          {/* Form */}
          <div className="space-y-5 px-6 py-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Academic Year Name
              </label>
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                  {error}
                </div>
              )}

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. 2083/84"
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Start Date
                </label>

                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  End Date
                </label>

                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 p-3">
              <input
                type="checkbox"
                name="isCurrent"
                checked={formData.isCurrent}
                onChange={handleChange}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />

              <div>
                <p className="text-sm font-medium text-slate-700">
                  Set as current academic year
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Only one academic year can be current at a time.
                </p>
              </div>
            </label>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={createAcademicYearMutation.isPending}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createAcademicYearMutation.isPending}
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createAcademicYearMutation.isPending
                ? "Creating..."
                : "Create Academic Year"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAcademicYearModal;
