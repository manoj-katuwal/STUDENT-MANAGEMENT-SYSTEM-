import { AlertTriangle, Mail, Shield, User, X } from "lucide-react";

const ROLE_LABELS = {
  ADMIN: "Admin",
  ACCOUNTANT: "Accountant",
  PRINCIPAL: "Principal",
  STUDENT: "Student",
};

const ViewUserModal = ({
  isOpen,
  user,
  isLoading = false,
  isError = false,
  error = null,
  onClose,
}) => {
  if (!isOpen) {
    return null;
  }

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-user-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div>
            <h2
              id="view-user-title"
              className="text-base font-semibold text-gray-900"
            >
              User Profile
            </h2>

            <p className="mt-1 text-sm leading-relaxed text-gray-500">
              View account information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close user profile"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {isLoading && (
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <div className="h-16 w-16 animate-pulse rounded-full bg-gray-200" />
                <div className="mt-3 h-4 w-32 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-4 w-16 animate-pulse rounded-full bg-gray-100" />
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
                <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
                <div className="h-12 animate-pulse rounded-xl bg-gray-100" />
              </div>
            </div>
          )}

          {isError && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3.5">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm font-medium leading-5 text-red-700">
                {error?.response?.data?.message ||
                  "Unable to load user profile."}
              </p>
            </div>
          )}

          {!isLoading && !isError && user && (
            <>
              {/* Avatar */}
              <div className="flex flex-col items-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-lg font-bold text-slate-700 ring-4 ring-slate-50">
                  {initials}
                </div>

                <h3 className="mt-3 text-lg font-semibold text-gray-900">
                  {user.name}
                </h3>

                <span className="mt-1.5 inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                  {ROLE_LABELS[user.role] || user.role}
                </span>
              </div>

              {/* Details */}
              <div className="mt-6 space-y-2.5">
                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-3 transition-colors hover:bg-gray-100/70">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-gray-200">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="truncate text-sm font-medium text-gray-700">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-3 transition-colors hover:bg-gray-100/70">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-gray-200">
                    <Shield className="h-4 w-4 text-gray-400" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Role</p>
                    <p className="text-sm font-medium text-gray-700">
                      {ROLE_LABELS[user.role] || user.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3.5 py-3 transition-colors hover:bg-gray-100/70">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white ring-1 ring-gray-200">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">Status</p>

                    <div className="flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        {user.isActive && (
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                        )}
                        <span
                          className={`relative inline-flex h-2 w-2 rounded-full ${
                            user.isActive ? "bg-emerald-500" : "bg-gray-400"
                          }`}
                        />
                      </span>

                      <p className="text-sm font-medium text-gray-700">
                        {user.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-100 bg-gray-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewUserModal;
