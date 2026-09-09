import React, { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Save, XCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { useClass, useUpdateClass } from "../../features/classes/class.hooks";

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
      },
    );
  };

  // Skeleton Loading State
  if (isLoading) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 px-4 py-6 animate-pulse">
        <div className="h-4 w-28 rounded bg-slate-200" />
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div className="h-6 w-40 rounded bg-slate-200" />
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-10 w-full rounded bg-slate-200" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-10 w-full rounded bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <XCircle className="h-6 w-6" />
          </div>
          <h2 className="text-base font-semibold text-slate-800">
            Failed to load class
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {error?.message ||
              "Something went wrong while fetching this class."}
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/classes")}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              Back to Classes
            </button>
            <button
              type="button"
              onClick={() => refetch()}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
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
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(`/classes/${classId}`)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Class Details</span>
      </button>

      {/* Main Form Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-slate-400" />
            <h1 className="text-base font-semibold text-slate-800">
              Edit Class Details
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Update the class name and identification code below.
          </p>
        </div>

        {/* Mutation Error Banner */}
        {updateClassMutation.isError && (
          <div className="mx-6 mt-6 flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3.5 text-sm text-rose-700">
            <XCircle className="h-5 w-5 shrink-0 text-rose-500" />
            <span>
              {updateClassMutation.error?.response?.data?.message ||
                "Failed to update class. Please check your inputs and try again."}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            {/* Class Name Input */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600"
              >
                Class Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Class 10"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 transition placeholder:font-normal placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
              />
            </div>

            {/* Class Code Input */}
            <div>
              <label
                htmlFor="code"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-600"
              >
                Class Code <span className="text-rose-500">*</span>
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. CLS10"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 font-mono text-sm font-medium uppercase text-slate-800 transition placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
              />
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
            <button
              type="button"
              onClick={() => navigate(`/classes/${classId}`)}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassEditPage;
