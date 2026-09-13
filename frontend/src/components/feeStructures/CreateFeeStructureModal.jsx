import { useState } from "react";

const CreateFeeStructureModal = ({
  academicYears = [],
  classList = [],
  onClose,
  onSubmit,
  isPending,
  error,
}) => {
  const [formData, setFormData] = useState({
    academicYearId: "",
    classId: "",
    feeType: "",
    amount: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">
              Add Fee Structure
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Configure fee defaults for a specific class and academic year.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-5">
            {error && (
              <div
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
              >
                {error.response?.data?.message ||
                  "Unable to create the fee structure. Please try again."}
              </div>
            )}
            {/* Academic Year */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Academic Year <span className="text-rose-500">*</span>
              </label>

              <select
                name="academicYearId"
                value={formData.academicYearId}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="" disabled>
                  Select academic year
                </option>
                {academicYears.map((academicYear) => (
                  <option key={academicYear._id} value={academicYear._id}>
                    {academicYear.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Class <span className="text-rose-500">*</span>
              </label>

              <select
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="" disabled>
                  Select class
                </option>
                {classList.map((classItem) => (
                  <option key={classItem._id} value={classItem._id}>
                    {classItem.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fee Type */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Fee Type <span className="text-rose-500">*</span>
              </label>

              <select
                name="feeType"
                value={formData.feeType}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-800 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="" disabled>
                  Select fee type
                </option>
                <option value="TUITION">Tuition</option>
                <option value="TRANSPORT">Transport</option>
                <option value="EXAM">Examination</option>
              </select>
            </div>

            {/* Amount */}
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Amount <span className="text-rose-500">*</span>
              </label>

              <div className="relative rounded-lg shadow-xs">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm text-slate-400">
                  $
                </span>
                <input
                  type="number"
                  name="amount"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-8 pr-3.5 text-sm font-medium text-slate-800 transition-colors placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
            >
              {isPending && (
                <svg
                  className="h-4 w-4 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {isPending ? "Creating..." : "Create Fee Structure"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFeeStructureModal;
