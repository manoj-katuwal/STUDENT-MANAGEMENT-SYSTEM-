import { useEffect, useState } from "react";
import {
  X,
  Calendar,
  GraduationCap,
  DollarSign,
  Tag,
  Loader2,
} from "lucide-react";

const EditFeeStructureModal = ({
  feeStructure,
  onClose,
  onSubmit,
  isPending,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Edit Fee Structure
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Update the details below to reflect the new fee rules.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-6">
            {/* Academic Year */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <Calendar className="h-4 w-4 text-indigo-500" />
                Academic Year
              </label>
              <select
                name="academicYearId"
                value={formData.academicYearId}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="">Select academic year</option>
                {academicYears.map((year) => (
                  <option key={year._id || year.id} value={year._id || year.id}>
                    {year.name || year.year}
                  </option>
                ))}
              </select>
            </div>

            {/* Class */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <GraduationCap className="h-4 w-4 text-indigo-500" />
                Class
              </label>
              <select
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="">Select class</option>
                {classList.map((cls) => (
                  <option key={cls._id || cls.id} value={cls._id || cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fee Type */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <Tag className="h-4 w-4 text-indigo-500" />
                Fee Type
              </label>
              <select
                name="feeType"
                value={formData.feeType}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="">Select fee type</option>
                <option value="TUITION">Tuition</option>
                <option value="TRANSPORT">Transport</option>
                <option value="EXAM">Examination</option>
              </select>
            </div>

            {/* Amount Input */}
            <div>
              <label className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <DollarSign className="h-4 w-4 text-indigo-500" />
                Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  min="0"
                  step="any"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              {isPending ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFeeStructureModal;
