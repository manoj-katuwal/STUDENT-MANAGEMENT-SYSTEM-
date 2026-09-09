import React, { useEffect } from "react";
import { AlertTriangle, Info, Loader2, X, AlertCircle } from "lucide-react";

const VARIANTS = {
  warning: {
    icon: AlertTriangle,
    iconBg: "bg-amber-50 text-amber-600 ring-amber-500/10",
    confirmBtn:
      "bg-amber-600 hover:bg-amber-700 text-white focus-visible:ring-amber-500",
  },
  danger: {
    icon: AlertCircle,
    iconBg: "bg-rose-50 text-rose-600 ring-rose-500/10",
    confirmBtn:
      "bg-rose-600 hover:bg-rose-700 text-white focus-visible:ring-rose-500",
  },
  info: {
    icon: Info,
    iconBg: "bg-slate-100 text-slate-700 ring-slate-500/10",
    confirmBtn:
      "bg-slate-900 hover:bg-slate-800 text-white focus-visible:ring-slate-900",
  },
};

const ConfirmModal = ({
  open,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  variant = "warning", // 'warning' | 'danger' | 'info'
  onConfirm,
  onCancel,
}) => {
  // Close on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open && !isLoading) {
        onCancel?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, isLoading, onCancel]);

  // Prevent background body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  const currentVariant = VARIANTS[variant] || VARIANTS.warning;
  const IconComponent = currentVariant.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with subtle blur */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={!isLoading ? onCancel : undefined}
      />

      {/* Modal Dialog Shell */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 transition-all animate-in zoom-in-95 duration-200"
      >
        {/* Close Icon Button */}
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          aria-label="Close modal"
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:pointer-events-none disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Content Body */}
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${currentVariant.iconBg}`}
          >
            <IconComponent className="h-5 w-5" />
          </div>

          <div className="mt-0.5 space-y-1.5 pr-6">
            <h2
              id="modal-title"
              className="text-base font-semibold text-slate-900"
            >
              {title}
            </h2>

            {message && (
              <p
                id="modal-description"
                className="text-sm leading-relaxed text-slate-500"
              >
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="inline-flex justify-center items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex justify-center items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 ${currentVariant.confirmBtn}`}
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            <span>{isLoading ? "Processing..." : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
