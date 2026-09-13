import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Save,
  XCircle,
  Loader2,
  Tag,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

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

  // Sync initial form state when record loads
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

    // Clear inline error on change
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
      <div className="min-h-screen bg-slate-50/60 p-4 sm:p-8">
        <div className="mx-auto max-w-4xl space-y-6 animate-pulse">
          <div className="h-4 w-36 rounded bg-slate-200" />
          <div className="h-28 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-64 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2" />
            <div className="h-64 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xl shadow-slate-200/50">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 ring-8 ring-rose-50/50">
            <XCircle className="h-7 w-7 text-rose-600" />
          </div>
          <h2 className="mt-5 text-lg font-bold text-slate-900">
            Failed to load class configuration
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">
            {error?.message ||
              "Something went wrong while fetching this class configuration."}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/classes")}
              className="inline-flex justify-center items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
            >
              Back to Classes
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex justify-center items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.98]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSaving = updateClassMutation.isPending;

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => navigate(`/classes/${classId}`)}
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 transition-colors hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Class Details</span>
          </button>
        </div>

        {/* Hero Header Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/40 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/10">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Edit Class Configuration
              </h1>
              <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                Modify administrative identifiers and class display names.
              </p>
            </div>
          </div>
        </div>

        {/* Global Mutation Error Banner */}
        {updateClassMutation.isError && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs font-medium text-rose-800 backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
            <span>
              {updateClassMutation.error?.response?.data?.message ||
                "Failed to update class. Please check your inputs and try again."}
            </span>
          </div>
        )}

        {/* Form & Live Preview Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Edit Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} noValidate>
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                  <h2 className="text-sm font-bold text-slate-900">
                    Class Parameters
                  </h2>
                  <p className="text-xs text-slate-500">
                    Ensure codes remain consistent with school standards.
                  </p>
                </div>

                <div className="space-y-6 p-6">
                  {/* Class Name Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="name"
                        className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-700 uppercase"
                      >
                        <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                        Class Name <span className="text-rose-500">*</span>
                      </label>
                      <span className="font-mono text-[11px] text-slate-400">
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
                      placeholder="e.g. Grade 10 - Science Stream"
                      maxLength={50}
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium text-slate-900 transition-all outline-none placeholder:text-slate-400 focus:ring-4 ${
                        errors.name
                          ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10"
                          : "border-slate-200 bg-white focus:border-indigo-500 focus:ring-indigo-500/10"
                      }`}
                    />
                    {errors.name && (
                      <p
                        id="name-error"
                        className="flex items-center gap-1.5 text-xs font-medium text-rose-600"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Class Code Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="code"
                        className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-700 uppercase"
                      >
                        <Tag className="h-3.5 w-3.5 text-slate-400" />
                        Class Code <span className="text-rose-500">*</span>
                      </label>
                      <span className="font-mono text-[11px] text-slate-400">
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
                      placeholder="e.g. CLS10-SCI"
                      maxLength={20}
                      aria-invalid={Boolean(errors.code)}
                      aria-describedby={errors.code ? "code-error" : undefined}
                      className={`w-full rounded-xl border px-3.5 py-2.5 font-mono text-sm font-semibold uppercase tracking-wider text-slate-900 transition-all outline-none placeholder:font-sans placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-400 focus:ring-4 ${
                        errors.code
                          ? "border-rose-300 bg-rose-50/30 focus:border-rose-500 focus:ring-rose-500/10"
                          : "border-slate-200 bg-white focus:border-indigo-500 focus:ring-indigo-500/10"
                      }`}
                    />
                    {errors.code && (
                      <p
                        id="code-error"
                        className="flex items-center gap-1.5 text-xs font-medium text-rose-600"
                      >
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {errors.code}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => navigate(`/classes/${classId}`)}
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    <span>{isSaving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Live Preview / Sidebar Info */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Sparkles className="h-4 w-4 text-indigo-500" /> Card Preview
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                How this class will appear in rosters and selectors.
              </p>

              <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/60 p-4 space-y-3">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Display Name
                  </span>
                  <p className="text-sm font-bold text-slate-800 truncate">
                    {formData.name || (
                      <span className="italic font-normal text-slate-400">
                        Untitled Class
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    System Reference Code
                  </span>
                  <div className="mt-1">
                    <span className="inline-flex items-center rounded-md bg-slate-200/70 px-2 py-0.5 font-mono text-xs font-semibold text-slate-700 border border-slate-300/50">
                      {formData.code || "NO-CODE"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 space-y-2">
                <div className="flex items-start gap-2 text-xs text-slate-500">
                  <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500 mt-0.5" />
                  <span>
                    Updating codes may impact automated fee mapping and
                    historical reports.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassEditPage;
