import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  GraduationCap,
  Tag,
  Loader2,
  AlertCircle,
  Coins,
} from "lucide-react";

const EditFeeStructureModal = ({
  feeStructure,
  onClose,
  onSubmit,
  isPending,
  error,
  academicYears = [],
  classList = [],
}) => {
  const [formData, setFormData] = useState({
    academicYearId: "",
    classId: "",
    feeType: "",
    amount: "",
  });

  useEffect(() => {
    if (!feeStructure) return;

    setFormData({
      academicYearId:
        feeStructure.academicYearId?._id || feeStructure.academicYearId || "",
      classId: feeStructure.classId?._id || feeStructure.classId || "",
      feeType: feeStructure.feeType || "",
      amount: feeStructure.amount ?? "",
    });
  }, [feeStructure]);

  // Handle ESC key press to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!feeStructure) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: Number(formData.amount),
    });
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
              <Coins className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Edit Fee Structure
              </h2>
              <p className="text-xs text-slate-500">
                Update academic fee configuration
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
                className="flex items-start gap-2.5 rounded-xl border border-red-200/80 bg-red-50/50 p-3.5 text-xs text-red-700"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <span>
                  {error.response?.data?.message ||
                    "Unable to update the fee structure. Please try again."}
                </span>
              </div>
            )}

            {/* Grid Layout for Academic Year & Class */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Academic Year */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  Academic Year
                </label>
                <select
                  name="academicYearId"
                  value={formData.academicYearId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">Select year</option>
                  {academicYears.map((year) => (
                    <option
                      key={year._id || year.id}
                      value={year._id || year.id}
                    >
                      {year.name || year.year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Class */}
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700">
                  <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                  Class
                </label>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">Select class</option>
                  {classList.map((cls) => (
                    <option key={cls._id || cls.id} value={cls._id || cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Fee Type */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-700">
                <Tag className="h-3.5 w-3.5 text-slate-400" />
                Fee Category
              </label>
              <select
                name="feeType"
                value={formData.feeType}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">Select category</option>
                <option value="TUITION">Tuition Fee</option>
                <option value="TRANSPORT">Transport Fee</option>
                <option value="EXAM">Examination Fee</option>
              </select>
            </div>

            {/* Amount Input */}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-700">
                Amount
              </label>
              <div className="relative rounded-lg shadow-sm">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-semibold text-slate-400">
                  Rs.
                </span>
                <input
                  type="number"
                  name="amount"
                  min="0"
                  step="any"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-3 text-sm font-semibold text-slate-900 outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
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
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isPending ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFeeStructureModal;
