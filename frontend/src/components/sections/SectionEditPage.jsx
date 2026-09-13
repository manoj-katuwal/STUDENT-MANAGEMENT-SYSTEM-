import { useEffect, useState, useMemo } from "react";
import {
  ArrowLeft,
  Loader2,
  Save,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  Layers,
  Sparkles,
  ChevronDown,
  Info,
  ShieldAlert,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useClasses } from "../../features/classes/class.hooks";
import {
  useSection,
  useUpdateSection,
} from "../../features/sections/section.hook";

const SectionEditPage = () => {
  const navigate = useNavigate();
  const { sectionId } = useParams();

  const {
    data: section,
    isLoading: sectionLoading,
    isError: sectionError,
    refetch: refetchSection,
  } = useSection(sectionId);

  const { data: classesData, isLoading: classesLoading } = useClasses({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

  const updateSectionMutation = useUpdateSection();

  const [formData, setFormData] = useState({ name: "", classId: "" });
  const [initialData, setInitialData] = useState({ name: "", classId: "" });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (section) {
      const initialValues = {
        name: section.name || "",
        classId: section.classId?._id || section.classId || "",
      };
      setFormData(initialValues);
      setInitialData(initialValues);
    }
  }, [section]);

  const isDirty = useMemo(() => {
    return (
      formData.name.trim() !== initialData.name ||
      formData.classId !== initialData.classId
    );
  }, [formData, initialData]);

  const classes = useMemo(() => classesData?.classes || [], [classesData]);

  const selectedClass = useMemo(
    () => classes.find((c) => c._id === formData.classId),
    [classes, formData.classId],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (successMessage) setSuccessMessage("");
  };

  const validate = () => {
    const newErrors = {};
    const trimmedName = formData.name.trim();

    if (!trimmedName) {
      newErrors.name = "Section name is required";
    } else if (trimmedName.length > 30) {
      newErrors.name = "Section name must be 30 characters or less";
    }

    if (!formData.classId) {
      newErrors.classId = "Please select a class";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate() || !isDirty) return;

    setSuccessMessage("");

    try {
      await updateSectionMutation.mutateAsync({
        sectionId,
        data: {
          name: formData.name.trim().toUpperCase(),
          classId: formData.classId,
        },
      });

      setSuccessMessage("Section updated successfully!");
      setTimeout(() => navigate(`/sections/${sectionId}`), 1000);
    } catch (error) {
      console.error("Failed to update section:", error);
    }
  };

  // Skeleton UI
  if (sectionLoading) {
    return (
      <div className="min-h-screen bg-slate-50/60 p-4 sm:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
          <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-96 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2" />
            <div className="h-64 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  // Error Card
  if (sectionError || !section) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xl shadow-slate-200/50">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 ring-8 ring-rose-50/50">
            <AlertCircle className="h-7 w-7 text-rose-600" />
          </div>
          <h3 className="mt-5 text-lg font-bold text-slate-900">
            Failed to load section
          </h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            The section details couldn't be retrieved. It may have been moved,
            deleted, or network connectivity failed.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => refetchSection()}
              className="inline-flex justify-center items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => navigate("/sections")}
              className="inline-flex justify-center items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.98]"
            >
              Back to Sections
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isSubmitting = updateSectionMutation.isPending;

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Navigation & Header */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => navigate(`/sections/${sectionId}`)}
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Section Details
          </button>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Edit Section
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Update section name and reassign primary class mapping.
              </p>
            </div>
            {isDirty && (
              <div className="self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Unsaved
                  Changes
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Two-Column Grid Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Form Area */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
              <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                <fieldset disabled={isSubmitting} className="space-y-6">
                  {/* Section Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-800"
                    >
                      <span className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-indigo-500" />
                        Section Name
                      </span>
                      <span className="text-xs text-slate-400 font-normal">
                        Max 30 chars
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. A, B, or Green"
                        className={`w-full rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none transition focus:bg-white focus:ring-4 ${
                          errors.name
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Class Select Field */}
                  <div>
                    <label
                      htmlFor="classId"
                      className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800"
                    >
                      <BookOpen className="h-4 w-4 text-indigo-500" />
                      Assigned Class
                    </label>
                    <div className="relative">
                      <select
                        id="classId"
                        name="classId"
                        value={formData.classId}
                        onChange={handleChange}
                        disabled={classesLoading || isSubmitting}
                        className={`w-full appearance-none rounded-xl border bg-slate-50/50 pl-4 pr-10 py-3 text-sm text-slate-900 outline-none transition focus:bg-white focus:ring-4 ${
                          errors.classId
                            ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/10"
                            : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                        }`}
                      >
                        <option value="">
                          {classesLoading
                            ? "Loading available classes..."
                            : "-- Select a Class --"}
                        </option>
                        {classes.map((classRecord) => (
                          <option key={classRecord._id} value={classRecord._id}>
                            {classRecord.name} ({classRecord.code})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top.1/2 top-3.5 h-4 w-4 text-slate-400" />
                    </div>
                    {errors.classId && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-rose-600">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        {errors.classId}
                      </p>
                    )}
                  </div>
                </fieldset>

                {/* Status Alerts */}
                {successMessage && (
                  <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-sm font-medium text-emerald-800 backdrop-blur-sm">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {updateSectionMutation.isError && (
                  <div className="mt-6 flex items-center gap-3 rounded-xl border border-rose-200/80 bg-rose-50/60 p-4 text-sm font-medium text-rose-800 backdrop-blur-sm">
                    <ShieldAlert className="h-5 w-5 shrink-0 text-rose-600" />
                    <span>
                      {updateSectionMutation.error?.response?.data?.message ||
                        "Failed to update section. Please try again."}
                    </span>
                  </div>
                )}

                {/* Form Actions */}
                <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                  <button
                    type="button"
                    onClick={() => navigate(`/sections/${sectionId}`)}
                    disabled={isSubmitting}
                    className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting || !isDirty}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 text-indigo-100" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar Summary Card */}
          <div className="space-y-4 lg:col-span-1">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                <Info className="h-4 w-4 text-indigo-500" /> Preview Summary
              </h3>

              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-xs font-medium text-slate-500">
                    Section Identifier
                  </dt>
                  <dd className="mt-1 font-semibold text-slate-900">
                    {formData.name.trim() ? (
                      <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-700/10">
                        {formData.name.trim().toUpperCase()}
                      </span>
                    ) : (
                      <span className="italic text-slate-400">
                        Not specified
                      </span>
                    )}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-medium text-slate-500">
                    Mapped Class
                  </dt>
                  <dd className="mt-1 font-medium text-slate-900">
                    {selectedClass ? (
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-slate-400" />
                        <span>{selectedClass.name}</span>
                        <span className="text-xs text-slate-400">
                          ({selectedClass.code})
                        </span>
                      </div>
                    ) : (
                      <span className="italic text-slate-400">
                        No class selected
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5 text-xs leading-relaxed text-indigo-950">
              <p className="font-semibold text-indigo-900 mb-1">💡 Quick Tip</p>
              Section names are automatically converted to uppercase (e.g., "a"
              becomes "A") upon saving to keep naming conventions consistent
              across all classes.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionEditPage;
