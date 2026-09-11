import { useState } from "react";
import { ArrowLeft, BookPlus, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCreateClass } from "../../features/classes/class.hooks";
import { validateClassForm } from "../../features/classes/class.validation";

const ClassCreatePage = ({ onCreated, onCancel, embedded = false }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });

  const [errors, setErrors] = useState({});

  const createClassMutation = useCreateClass();

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
    const formErrors = validateClassForm(formData);
    setErrors((prev) => ({
      ...prev,
      [name]: formErrors[name] || "",
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateClassForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    createClassMutation.mutate(
      {
        name: formData.name.trim(),
        code: formData.code.trim().toUpperCase(),
      },
      {
        onSuccess: () => {
          if (onCreated) {
            onCreated();
            return;
          }

          navigate("/classes");
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

  const isPending =
    createClassMutation.isPending || createClassMutation.isLoading;

  return (
    <div className={embedded ? "" : "mx-auto max-w-2xl space-y-4 px-4 py-6"}>
      {/* Back Button */}
      {!embedded && <button
        type="button"
        onClick={() => (onCancel ? onCancel() : navigate("/classes"))}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Classes</span>
      </button>}

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
              "Failed to create class. Please check your inputs and try again."}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-5 p-6">
            {/* Class Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="name"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  Class Name <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
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
                className={`w-full rounded-lg border px-3.5 py-2.5 text-sm font-medium text-slate-800 transition placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20"
                    : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-rose-600">{errors.name}</p>
              )}
            </div>

            {/* Class Code */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="code"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-600"
                >
                  Class Code <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
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
                className={`w-full rounded-lg border px-3.5 py-2.5 font-mono text-sm font-medium uppercase text-slate-800 transition placeholder:font-sans placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                  errors.code
                    ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 bg-rose-50/20"
                    : "border-slate-200 focus:border-slate-400 focus:ring-slate-100"
                }`}
              />
              {errors.code && (
                <p className="mt-1.5 text-xs text-rose-600">{errors.code}</p>
              )}
            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/50 px-6 py-3.5">
            <button
              type="button"
              onClick={() => (onCancel ? onCancel() : navigate("/classes"))}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              <span>{isPending ? "Creating..." : "Create Class"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClassCreatePage;
