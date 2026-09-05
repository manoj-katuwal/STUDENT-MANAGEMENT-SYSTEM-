import { AlertTriangle, CheckCircle, X, XCircle } from "lucide-react";

const UserStatusModal = ({
  isOpen,
  user,
  action,
  onClose,
  onConfirm,
  isPending = false,
  error = null,
}) => {
  if (!isOpen || !user) {
    return null;
  }

  const isActivating = action === "activate";

  const title = isActivating ? "Activate User" : "Deactivate User";

  const description = isActivating
    ? "This will restore the user's access to the system."
    : "This will disable the user's access to the system.";

  const confirmText = isActivating ? "Activate User" : "Deactivate User";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 animate-in fade-in duration-150">
      <div
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-status-title"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-start gap-3.5">
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-4 ${
                isActivating
                  ? "bg-emerald-50 text-emerald-600 ring-emerald-50/50"
                  : "bg-amber-50 text-amber-600 ring-amber-50/50"
              }`}
            >
              {isActivating ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>

            <div>
              <h2
                id="user-status-title"
                className="text-base font-semibold text-gray-900"
              >
                {title}
              </h2>

              <p className="mt-1 text-sm leading-relaxed text-gray-500">
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            aria-label="Close status confirmation"
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-[15px] leading-7 text-gray-600">
            Are you sure you want to{" "}
            <span className="font-semibold text-gray-900">
              {isActivating ? "activate" : "deactivate"}
            </span>{" "}
            <span className="font-semibold text-gray-900">{user.name}</span>?
          </p>

          {error && (
            <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-3">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm leading-5 text-red-700">
                {error?.response?.data?.message ||
                  `Failed to ${
                    isActivating ? "activate" : "deactivate"
                  } user. Please try again.`}
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
            disabled={isPending}
            className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 ${
              isActivating
                ? "bg-emerald-600 hover:bg-emerald-700 focus-visible:ring-emerald-500"
                : "bg-amber-600 hover:bg-amber-700 focus-visible:ring-amber-500"
            }`}
          >
            {isPending && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {isPending ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserStatusModal;
