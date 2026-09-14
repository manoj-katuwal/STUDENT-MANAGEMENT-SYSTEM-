import React, { useState, useEffect } from "react";
import {
  X,
  AlertCircle,
  Loader2,
  ChevronDown,
  CheckCircle2,
  Receipt,
} from "lucide-react";
import { useFeeStructures } from "../../features/feeStructures/feeStructure.hook";
import { useAcademicYears } from "../../features/academicYear/academicYear.hooks";
import { useStudents } from "../../features/students/student.hooks";

const INITIAL_FORM_STATE = {
  studentId: "",
  academicYearId: "",
  feeStructureId: "",
  discountAmount: "",
};

const StudentFeeAssignModal = ({
  isOpen = true,
  onClose,
  onSubmit,
  isSubmitting = false,
  serverError = "", // Backend Duplicate error handle गर्न
}) => {
  const { data: studentsData, isLoading: studentsLoading } = useStudents({
    page: 1,
    limit: 100,
  });

  const { data: academicYearsData, isLoading: academicYearsLoading } =
    useAcademicYears({
      page: 1,
      limit: 100,
    });

  const { data: feeStructuresData, isLoading: feeStructuresLoading } =
    useFeeStructures({
      page: 1,
      limit: 100,
      status: "ACTIVE", // Only ACTIVE Fee Structures
    });

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});

  // Active Academic Years filter
  const activeAcademicYears = (academicYearsData?.academicYears || []).filter(
    (year) => year.status === "ACTIVE",
  );

  // Selected Fee Structure details
  const selectedStructure = feeStructuresData?.feeStructures?.find(
    (s) => s._id === formData.feeStructureId,
  );
  const baseAmount = selectedStructure?.amount ?? 0;
  const discountVal = Number(formData.discountAmount || 0);
  const netAmount = Math.max(0, baseAmount - discountVal);

  // Modal open/close हुँदा Form and Errors reset
  useEffect(() => {
    if (!isOpen) {
      setFormData(INITIAL_FORM_STATE);
      setErrors({});
    }
  }, [isOpen]);

  // Real-time Field Validation
  const validateField = (name, value, currentFormData = formData) => {
    let newErrors = { ...errors };

    if (name === "studentId") {
      if (!value) newErrors.studentId = "Student is required.";
      else delete newErrors.studentId;
    }

    if (name === "academicYearId") {
      if (!value) newErrors.academicYearId = "Academic Year is required.";
      else delete newErrors.academicYearId;
    }

    if (name === "feeStructureId") {
      if (!value) newErrors.feeStructureId = "Fee Structure is required.";
      else delete newErrors.feeStructureId;
    }

    if (name === "discountAmount" || name === "feeStructureId") {
      const discount = name === "discountAmount" ? Number(value) : discountVal;
      const fee =
        name === "feeStructureId"
          ? (feeStructuresData?.feeStructures?.find((s) => s._id === value)
              ?.amount ?? 0)
          : baseAmount;

      if (discount < 0) {
        newErrors.discountAmount = "Discount cannot be negative.";
      } else if (fee > 0 && discount > fee) {
        newErrors.discountAmount =
          "Discount cannot be greater than the total fee amount.";
      } else {
        delete newErrors.discountAmount;
      }
    }

    setErrors(newErrors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };
    setFormData(updatedForm);
    validateField(name, value, updatedForm);
  };

  // Full Form Validation before Submit
  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentId) newErrors.studentId = "Student is required.";
    if (!formData.academicYearId)
      newErrors.academicYearId = "Academic Year is required.";
    if (!formData.feeStructureId)
      newErrors.feeStructureId = "Fee Structure is required.";

    if (discountVal < 0) {
      newErrors.discountAmount = "Discount cannot be negative.";
    } else if (baseAmount > 0 && discountVal > baseAmount) {
      newErrors.discountAmount =
        "Discount cannot be greater than the total fee amount.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit?.({
      studentId: formData.studentId,
      academicYearId: formData.academicYearId,
      feeStructureId: formData.feeStructureId,
      discountAmount: discountVal,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-md animate-in fade-in duration-200"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4.5 dark:border-slate-800/80 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                Assign Student Fee
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Link a fee structure to a student for an academic year.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4.5 px-6 py-5">
            {/* Backend Server Error (Duplicate entry validation) */}
            {serverError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-medium text-rose-700 dark:bg-rose-950/30 dark:text-rose-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            {/* Student Select */}
            <div className="space-y-1.5">
              <label
                htmlFor="studentId"
                className="block text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400"
              >
                Student <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <select
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  disabled={studentsLoading}
                  className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 shadow-sm transition duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 dark:bg-slate-950 dark:text-slate-100 dark:disabled:bg-slate-900 ${
                    errors.studentId
                      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700"
                  }`}
                >
                  <option value="">
                    {studentsLoading ? "Loading students..." : "Select student"}
                  </option>
                  {(studentsData?.students || []).map((student) => (
                    <option key={student._id} value={student._id}>
                      {student.name}{" "}
                      {student.admissionNumber
                        ? `(${student.admissionNumber})`
                        : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              {errors.studentId && (
                <p className="text-xs font-medium text-rose-500">
                  {errors.studentId}
                </p>
              )}
            </div>

            {/* Academic Year Select (Filter ONLY ACTIVE) */}
            <div className="space-y-1.5">
              <label
                htmlFor="academicYearId"
                className="block text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400"
              >
                Academic Year <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <select
                  id="academicYearId"
                  name="academicYearId"
                  value={formData.academicYearId}
                  onChange={handleChange}
                  disabled={academicYearsLoading}
                  className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 shadow-sm transition duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 dark:bg-slate-950 dark:text-slate-100 dark:disabled:bg-slate-900 ${
                    errors.academicYearId
                      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700"
                  }`}
                >
                  <option value="">
                    {academicYearsLoading
                      ? "Loading academic years..."
                      : "Select academic year"}
                  </option>
                  {activeAcademicYears.map((year) => (
                    <option key={year._id} value={year._id}>
                      {year.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              {errors.academicYearId && (
                <p className="text-xs font-medium text-rose-500">
                  {errors.academicYearId}
                </p>
              )}
            </div>

            {/* Fee Structure Select */}
            <div className="space-y-1.5">
              <label
                htmlFor="feeStructureId"
                className="block text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400"
              >
                Fee Structure <span className="text-rose-500">*</span>
              </label>

              <div className="relative">
                <select
                  id="feeStructureId"
                  name="feeStructureId"
                  value={formData.feeStructureId}
                  onChange={handleChange}
                  disabled={feeStructuresLoading}
                  className={`w-full appearance-none rounded-xl border bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 shadow-sm transition duration-150 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 dark:bg-slate-950 dark:text-slate-100 dark:disabled:bg-slate-900 ${
                    errors.feeStructureId
                      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700"
                  }`}
                >
                  <option value="">
                    {feeStructuresLoading
                      ? "Loading fee structures..."
                      : "Select fee structure"}
                  </option>
                  {(feeStructuresData?.feeStructures || []).map((structure) => (
                    <option key={structure._id} value={structure._id}>
                      {structure.feeType} — NPR{" "}
                      {(structure.amount ?? 0).toLocaleString()}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              {errors.feeStructureId && (
                <p className="text-xs font-medium text-rose-500">
                  {errors.feeStructureId}
                </p>
              )}
            </div>

            {/* Discount Amount */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="discountAmount"
                  className="block text-xs font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400"
                >
                  Discount Amount
                </label>
                <span className="text-[11px] font-medium text-slate-400">
                  Optional
                </span>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <span className="text-xs font-semibold text-slate-400">
                    NPR
                  </span>
                </div>

                <input
                  id="discountAmount"
                  name="discountAmount"
                  type="number"
                  min="0"
                  value={formData.discountAmount}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={`w-full rounded-xl border bg-white py-2.5 pl-14 pr-3.5 text-sm text-slate-900 shadow-sm transition duration-150 focus:outline-none focus:ring-2 dark:bg-slate-950 dark:text-slate-100 ${
                    errors.discountAmount
                      ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20"
                      : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/20 dark:border-slate-700"
                  }`}
                />
              </div>

              {errors.discountAmount ? (
                <p className="text-xs font-medium text-rose-500">
                  {errors.discountAmount}
                </p>
              ) : (
                <p className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                  <AlertCircle className="h-3 w-3 shrink-0 text-slate-400" />
                  Leave 0 if no discount is applicable.
                </p>
              )}
            </div>

            {/* Selected Summary / Preview Card */}
            {selectedStructure && (
              <div className="mt-2 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3.5 dark:border-indigo-950 dark:bg-indigo-950/20">
                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                  <span>Fee Amount:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-200">
                    NPR {baseAmount.toLocaleString()}
                  </span>
                </div>
                {discountVal > 0 && (
                  <div className="mt-1 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
                    <span>Discount:</span>
                    <span className="font-medium">
                      - NPR {discountVal.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="mt-2 flex items-center justify-between border-t border-indigo-100/80 pt-2 text-xs font-semibold text-indigo-950 dark:border-indigo-900/50 dark:text-indigo-200">
                  <span>Net Amount:</span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    NPR {netAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4 dark:border-slate-800/80 dark:bg-slate-900/50">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 transition duration-150 hover:bg-slate-50 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-400 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition duration-150 hover:bg-indigo-700 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:pointer-events-none disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Assigning...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Assign Fee</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFeeAssignModal;
