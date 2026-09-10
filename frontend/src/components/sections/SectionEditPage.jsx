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
      <div className="mx-auto max-w-3xl space-y-6 p-8">
        <div className="h-6 w-36 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-10 w-64 animate-pulse rounded-lg bg-slate-200" />
        <div className="h-80 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm" />
      </div>
    );
  }

  // Error Card
  if (sectionError || !section) {
    return (
      <div className="mx-auto my-12 max-w-lg p-4">
        <div className="rounded-2xl border border-red-100 bg-red-50/50 p-8 text-center backdrop-blur-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            Failed to load section
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            The section details couldn't be retrieved right now.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => refetchSection()}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => navigate("/sections")}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 active:scale-[0.98]"
            >
              Back to Sections
            </button>
          </div>
        </div>
      </div>
    );
  }

  const classes = classesData?.classes || [];
  const isSubmitting = updateSectionMutation.isPending;

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 sm:p-8">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Navigation & Header */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => navigate(`/sections/${sectionId}`)}
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Section Details
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                Edit Section
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Update details and assign this section to a primary class.
              </p>
            </div>
            {isDirty && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/20">
                <Sparkles className="h-3.5 w-3.5" /> Unsaved Changes
              </span>
            )}
          </div>
        </div>

        {/* Main Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <fieldset disabled={isSubmitting} className="space-y-6">
              {/* Section Name Field */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800"
                >
                  <Layers className="h-4 w-4 text-indigo-500" />
                  Section Name
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
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10"
                    }`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-2 flex items-center gap-1 text-xs font-medium text-red-600">
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
                    className={`w-full appearance-none rounded-xl border bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:bg-white focus:ring-4 ${
                      errors.classId
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500/10"
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
                </div>
                {errors.classId && (
                  <p className="mt-2 flex items-center gap-1 text-xs font-medium text-red-600">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    {errors.classId}
                  </p>
                )}
              </div>
            </fieldset>

            {/* Success Banner */}
            {successMessage && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4 text-sm font-medium text-emerald-800 backdrop-blur-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Error Banner */}
            {updateSectionMutation.isError && (
              <div className="mt-6 flex items-center gap-3 rounded-xl border border-red-200/80 bg-red-50/60 p-4 text-sm font-medium text-red-800 backdrop-blur-sm">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                <span>
                  {updateSectionMutation.error?.response?.data?.message ||
                    "Failed to update section. Please try again."}
                </span>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-8 flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
              <button
                type="button"
                onClick={() => navigate(`/sections/${sectionId}`)}
                disabled={isSubmitting}
                className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 text-slate-300" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SectionEditPage;
