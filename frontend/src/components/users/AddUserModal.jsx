import { useState, useEffect } from "react";
import { Eye, EyeOff, UserPlus, X, XCircle } from "lucide-react";

const ROLES = [
  { value: "ADMIN", label: "Admin" },
  { value: "ACCOUNTANT", label: "Accountant" },
  { value: "PRINCIPAL", label: "Principal" },
  { value: "STUDENT", label: "Student" },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  password: "",
  role: "",
};

const AddUserModal = ({
  isOpen,
  onClose,
  onSubmit,
  isCreating = false,
  error = null,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [formErrors, setFormErrors] = useState({});

  const resetForm = () => {
    setFormData(INITIAL_FORM);
    setFormErrors({});
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose?.();
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const validateForm = () => {
    const errors = {};
    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();

    if (!trimmedName) {
      errors.name = "Name is required.";
    } else if (trimmedName.length < 2) {
      errors.name = "Name must be at least 2 characters.";
    } else if (trimmedName.length > 100) {
      errors.name = "Name must not exceed 100 characters.";
    }

    if (!trimmedEmail) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.password) {
      errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    } else if (formData.password.length > 128) {
      errors.password = "Password must not exceed 128 characters.";
    }

    if (!formData.role) {
      errors.role = "Please select a role.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit?.({
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const getInputClass = (fieldName) =>
    `w-full rounded-lg border bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 transition-colors focus:bg-white focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${
      formErrors[fieldName]
        ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
        : "border-gray-200 focus:border-indigo-500 focus:ring-indigo-500/20"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-user-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 ring-4 ring-indigo-50/50">
              <UserPlus className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="add-user-title"
                className="text-base font-semibold text-gray-900"
              >
                Add New User
              </h2>

              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                Create a new user account.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isCreating}
            aria-label="Close add user modal"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 px-6 py-5">
            {/* Full Name */}
            <div>
              <label
                htmlFor="add-user-name"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="add-user-name"
                name="name"
                type="text"
                placeholder="e.g. Ram Sharma"
                value={formData.name}
                onChange={handleChange}
                disabled={isCreating}
                className={getInputClass("name")}
              />
              {formErrors.name && (
                <p className="mt-1.5 text-xs text-red-600">{formErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="add-user-email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                id="add-user-email"
                name="email"
                type="email"
                placeholder="name@school.edu"
                value={formData.email}
                onChange={handleChange}
                disabled={isCreating}
                className={getInputClass("email")}
              />
              {formErrors.email && (
                <p className="mt-1.5 text-xs text-red-600">
                  {formErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="add-user-password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="add-user-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isCreating}
                  className={`${getInputClass("password")} pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isCreating}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 transition-colors hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1.5 text-xs text-red-600">
                  {formErrors.password}
                </p>
              )}
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="add-user-role"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Role
              </label>
              <select
                id="add-user-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                disabled={isCreating}
                className={getInputClass("role")}
              >
                <option value="" disabled>
                  Select a role
                </option>
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {formErrors.role && (
                <p className="mt-1.5 text-xs text-red-600">{formErrors.role}</p>
              )}
            </div>

            {/* Backend Error Alert */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
                <p className="text-sm leading-5 text-red-700">
                  {error?.response?.data?.message ||
                    "Failed to create user. Please try again."}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 rounded-b-2xl">
            <button
              type="button"
              onClick={handleClose}
              disabled={isCreating}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isCreating}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCreating && (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {isCreating ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
