import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Save,
  XCircle,
  Loader2,
  Tag,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useClass, useUpdateClass } from "../../features/classes/class.hooks";
import { validateClassForm } from "../../features/classes/class.validation";

const ClassEditPage = () => {
  const navigate = useNavigate();
  const { classId } = useParams();

  const {
    data: classRecord,
    isLoading,
    isError,
    error,
    refetch,
  } = useClass(classId);
  const updateClassMutation = useUpdateClass();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (classRecord) {
      setFormData({
        name: classRecord.name || "",
        code: classRecord.code || "",
      });
    }
  }, [classRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = name === "code" ? value.toUpperCase() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const formErrors = validateClassForm(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: formErrors[name] || "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setTouched({ name: true, code: true });
    const validationErrors = validateClassForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    updateClassMutation.mutate(
      {
        classId,
        data: {
          name: formData.name.trim(),
          code: formData.code.trim().toUpperCase(),
        },
      },
      {
        onSuccess: () => {
          navigate(`/classes/${classId}`);
        },
        onError: (err) => {
          const apiMessage = err?.response?.data?.message || "";
          if (apiMessage.toLowerCase().includes("name already exists")) {
            setErrors((prev) => ({ ...prev, name: apiMessage }));
          } else if (apiMessage.toLowerCase().includes("code already exists")) {
            setErrors((prev) => ({ ...prev, code: apiMessage }));
          }
        },
      },
    );
  };

  // Skeleton Loading State
  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-8 animate-pulse">
        <div className="h-5 w-36 rounded-lg bg-slate-200/80" />
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="border-b border-slate-100 bg-slate-50/50 p-6 space-y-2">
            <div className="h-5 w-48 rounded bg-slate-200" />
            <div className="h-3.5 w-72 rounded bg-slate-200" />
          </div>
          <div className="p-6 space-y-5">
            <div className="space-y-2">
              <div className="h-3.5 w-24 rounded bg-slate-200" />
              <div className="h-10 w-full rounded-lg bg-slate-100" />
            </div>
            <div className="space-y-2">
              <div className="h-3.5 w-24 rounded bg-slate-200" />
              <div className="h-10 w-full rounded-lg bg-slate-100" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-xl ring-1 ring-slate-950/5">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-500/10">
            <XCircle className="h-6 w-6" />
          </div>
          <h2 className="text-base font-semibold text-slate-900">
            Failed to load class
          </h2>
          <p className="mt-1.5 text-xs text-slate-500 max-w-sm mx-auto">
            {error?.message ||
              "Something went wrong while fetching this class configuration."}
          </p>
          <div className="mt-6 flex justify-center gap-2.5">
            <button
              type="button"
              onClick={() => navigate("/classes")}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50"
            >
              Back to Classes
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSaving =
    updateClassMutation.isPending || updateClassMutation.isLoading;

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-8 animate-in fade-in duration-200">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(`/classes/${classId}`)}
        className="group inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-indigo-600"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        <span>Back to Class Details</span>
      </button>

      {/* Main Form Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl ring-1 ring-slate-950/5">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/10">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-900">
                Edit Class Configuration
              </h1>
              <p className="text-xs text-slate-500">
                Update the class title and unique identification code
              </p>
            </div>
          </div>
        </div>

        {/* Mutation Error Banner */}
        {updateClassMutation.isError && (
          <div className="mx-6 mt-6 flex items-start gap-2.5 rounded-xl border border-rose-200/80 bg-rose-50/50 p-3.5 text-xs text-rose-700 animate-in fade-in duration-150">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            <span>
              {updateClassMutation.error?.response?.data?.message ||
                "Failed to update class. Please check your inputs and try again."}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5 p-6">
            {/* Class Name Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="name"
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-700"
                >
                  <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                  Class Name <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {formData.name.length}/50
                </span>
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. Class 10"
                maxLength={50}
                className={`w-full rounded-lg border px-3.5 py-2 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:ring-2 ${
                  errors.name
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 bg-white"
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Class Code Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="code"
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-700"
                >
                  <Tag className="h-3.5 w-3.5 text-slate-400" />
                  Class Code <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-mono">
                  {formData.code.length}/20
                </span>
              </div>
              <input
                id="code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="e.g. CLS10"
                maxLength={20}
                className={`w-full rounded-lg border px-3.5 py-2 font-mono text-sm font-semibold uppercase text-slate-900 outline-none transition-all placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 focus:ring-2 ${
                  errors.code
                    ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20 bg-rose-50/20"
                    : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 bg-white"
                }`}
              />
              {errors.code && (
                <p className="mt-1.5 text-xs text-rose-600 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3 shrink-0" />
                  {errors.code}
                </p>
              )}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
            <button
              type="button"
              onClick={() => navigate(`/classes/${classId}`)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isSaving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassEditPage;
