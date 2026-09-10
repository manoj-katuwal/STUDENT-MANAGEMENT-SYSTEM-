import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Layers,
  GraduationCap,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useClasses } from "../../features/classes/class.hooks";
import { useCreateSection } from "../../features/sections/section.hook";
import { useState } from "react";

const SectionCreatePage = () => {
  const navigate = useNavigate();

  const { data: classesData, isLoading: classesLoading } = useClasses({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

  const createSectionMutation = useCreateSection();

  const [formData, setFormData] = useState({
    name: "",
    classId: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Section name is required";
    } else if (formData.name.trim().length > 30) {
      newErrors.name = "Section name must be 30 characters or less";
    }

    if (!formData.classId) {
      newErrors.classId = "Please select an academic class";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      await createSectionMutation.mutateAsync({
        name: formData.name.trim().toUpperCase(),
        classId: formData.classId,
      });

      navigate("/sections");
    } catch (error) {
      console.error("Failed to create section:", error);
    }
  };

  const classes = classesData?.classes || [];

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header & Breadcrumb */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/sections")}
          className="group mb-3 inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Sections</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Add New Section
            </h1>
            <p className="text-xs font-medium text-slate-500">
              Create a new academic section and assign it to a parent class.
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Section Name Input */}
            <div className="sm:col-span-2">
              <label
                htmlFor="name"
                className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                <span>
                  Section Name <span className="text-red-500">*</span>
                </span>
                <span className="text-[10px] font-normal text-slate-400">
                  {formData.name.length}/30 Max
                </span>
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Layers className="h-4 w-4" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. A, B, or Section-1"
                  className={`w-full rounded-xl border bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white ${
                    errors.name
                      ? "border-red-300 ring-2 ring-red-500/10 focus:border-red-500"
                      : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10"
                  }`}
                />
              </div>

              {errors.name && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.name}</span>
                </p>
              )}
            </div>

            {/* Class Select Input */}
            <div className="sm:col-span-2">
              <label
                htmlFor="classId"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Assign to Class <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <select
                  id="classId"
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  disabled={classesLoading}
                  className={`w-full rounded-xl border bg-slate-50/50 pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all focus:bg-white disabled:cursor-not-allowed disabled:opacity-60 ${
                    errors.classId
                      ? "border-red-300 ring-2 ring-red-500/10 focus:border-red-500"
                      : "border-slate-200 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/10"
                  }`}
                >
                  <option value="">
                    {classesLoading
                      ? "Loading active classes..."
                      : "Select parent class"}
                  </option>

                  {classes.map((classRecord) => (
                    <option key={classRecord._id} value={classRecord._id}>
                      {classRecord.name} ({classRecord.code})
                    </option>
                  ))}
                </select>
              </div>

              {errors.classId && (
                <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.classId}</span>
                </p>
              )}
            </div>
          </div>

          {/* API Error Box */}
          {createSectionMutation.isError && (
            <div className="flex items-start gap-3 rounded-xl border border-red-200/80 bg-red-50/50 p-4 text-xs font-medium text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800">Submission Failed</p>
                <p className="mt-0.5">
                  {createSectionMutation.error?.response?.data?.message ||
                    "Failed to create section. Please check the details and try again."}
                </p>
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              type="button"
              onClick={() => navigate("/sections")}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 shadow-xs transition-all hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createSectionMutation.isPending}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              {createSectionMutation.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Creating Section...</span>
                </>
              ) : (
                <span>Create Section</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionCreatePage;
