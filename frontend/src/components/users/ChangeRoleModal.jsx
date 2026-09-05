import { Shield, X, XCircle } from "lucide-react";

const ROLES = [
  {
    value: "ADMIN",
    label: "Admin",
  },
  {
    value: "ACCOUNTANT",
    label: "Accountant",
  },
  {
    value: "PRINCIPAL",
    label: "Principal",
  },
  {
    value: "STUDENT",
    label: "Student",
  },
];

const ChangeRoleModal = ({
  isOpen,
  user,
  selectedRole,
  onRoleChange,
  onClose,
  onConfirm,
  isPending = false,
  error = null,
}) => {
  if (!isOpen || !user) {
    return null;
  }

  const currentRole = user.role;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="change-role-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-4 ring-blue-50/50">
              <Shield className="h-5 w-5" />
            </div>

            <div>
              <h2
                id="change-role-title"
                className="text-base font-semibold text-gray-900"
              >
                Change User Role
              </h2>

              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                Update this user's system role.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close change role modal"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <div className="mb-5 flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                User
              </p>
              <p className="mt-0.5 text-sm font-semibold text-gray-900">
                {user.name}
              </p>
            </div>

            <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
              {currentRole}
            </span>
          </div>

          <div>
            <label
              htmlFor="user-role"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Role
            </label>

            <select
              id="user-role"
              value={selectedRole}
              onChange={(e) => onRoleChange(e.target.value)}
              disabled={isPending}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-gray-700 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
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
          </div>

          {currentRole === selectedRole && (
            <p className="mt-2.5 flex items-center gap-1.5 text-xs text-gray-500">
              <span className="h-1.5 w-1.5 rounded-full bg-gray-300" />
              This is already the user's current role.
            </p>
          )}

          {error && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm leading-5 text-red-700">
                {error?.response?.data?.message ||
                  "Failed to change user role. Please try again."}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-6 py-4 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={
              isPending || !selectedRole || selectedRole === currentRole
            }
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {isPending ? "Processing..." : "Change Role"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeRoleModal;
