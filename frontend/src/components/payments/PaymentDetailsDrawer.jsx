import {
  X,
  User,
  Receipt,
  CreditCard,
  CalendarDays,
  Building2,
  CheckCircle2,
  Printer,
  Hash,
  ArrowUpRight,
} from "lucide-react";

const PaymentDetailsDrawer = ({ isOpen = true, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="flex w-screen max-w-md flex-col border-l border-slate-200/80 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <Hash className="h-3 w-3" />
                Transaction ID
              </span>
              <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                TXN-89401
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/60 bg-slate-50 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Amount & Status Card */}
            <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-linear-to-br from-slate-50 via-white to-slate-50/50 p-5 shadow-xs">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Payment Amount
              </p>

              <div className="mt-2 flex items-baseline justify-between gap-2">
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  NPR 15,000
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-200/60">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Success
                </span>
              </div>
            </div>

            {/* Student Information */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Student Details
              </h3>

              <div className="rounded-2xl border border-slate-200/80 bg-white divide-y divide-slate-100 shadow-xs">
                <div className="flex items-center gap-3.5 p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80">
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">
                      Student Name
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      Soma Katwal
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100/80">
                    <Receipt className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">
                      Admission No
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      INT-TEST-002
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Payment Overview
              </h3>

              <div className="rounded-2xl border border-slate-200/80 bg-white divide-y divide-slate-100 shadow-xs">
                <div className="flex items-center gap-3.5 p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100/80">
                    <Receipt className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">
                      Fee Reference
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      Tuition Fee - Term 1
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100/80">
                    <CreditCard className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">
                      Payment Method
                    </p>
                    <p className="text-sm font-semibold text-slate-800">Cash</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/80">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">
                      Payment Type
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      Fee Payment
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 p-3.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 border border-slate-200/60">
                    <CalendarDays className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-slate-400">
                      Paid Date & Time
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      Sep 16, 2026 • 10:42 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-slate-100 bg-slate-50/50 p-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all hover:bg-slate-800 active:scale-[0.98]"
              >
                <Printer className="h-4 w-4" />
                <span>Print Receipt</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 active:scale-[0.98]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsDrawer;
