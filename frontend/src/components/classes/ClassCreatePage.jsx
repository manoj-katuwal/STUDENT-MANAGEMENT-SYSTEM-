import React, { useState } from "react";
import { ArrowLeft, BookPlus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateClass } from "../../features/classes/class.hooks";

const ClassCreatePage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });

  const createClassMutation = useCreateClass();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    createClassMutation.mutate(
      {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
      },
      {
        onSuccess: () => {
          navigate("/classes");
        },
      },
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4 px-4 py-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate("/classes")}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Classes</span>
      </button>

      {/* Main Card */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <div className="flex items-center gap-2">
            <BookPlus className="h-5 w-5 text-slate-400" />
            <h1 className="text-base font-semibold text-slate-800">
              Add New Class
            </h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Create a new academic class record in the system.
          </p>
        </div>

        {createClassMutation.isError && (
          <div className="mx-6 mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {createClassMutation.error?.response?.data?.message ||
              "Failed to create class. Please try again."}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5 p-6">
            {/* Class Name */}
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
                minLength={2}
                maxLength={50}
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Class 10"
                className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm font-medium text-slate-800 transition placeholder:font-normal placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-100"
              />
            </div>

            {/* Class Code */}
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
                minLength={2}
                maxLength={20}
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
              onClick={() => navigate("/classes")}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={createClassMutation.isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Plus className="h-4 w-4" />
              <span>
                {" "}
                {createClassMutation.isPending ? "Creating..." : "Create Class"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassCreatePage;
