import { AlertTriangle, X, ShieldAlert, Ban } from "lucide-react";

const StudentFeeCancelModal = ({
  studentFee,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!studentFee) {
    return null;
  }

  const studentName = studentFee.studentId?.name ?? "—";
  const admissionNo = studentFee.studentId?.admissionNumber ?? "—";
  const feeType = studentFee.feeStructureId?.feeType ?? "Academic Fee";
  const totalAmount = studentFee.totalAmount ?? 0;
  const paidAmount = studentFee.paidAmount ?? 0;
  const dueAmount = studentFee.dueAmount ?? 0;

  // Rule: Cannot cancel if payment already exists (Paid > 0)
  const hasPayment = paidAmount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl shrink-0 ${
                hasPayment
                  ? "bg-amber-100 text-amber-700"
                  : "bg-rose-100 text-rose-700"
              }`}
            >
              {hasPayment ? (
                <ShieldAlert className="h-5 w-5" />
              ) : (
                <AlertTriangle className="h-5 w-5" />
              )}
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {hasPayment ? "Cancellation Restricted" : "Cancel Student Fee"}
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {hasPayment
                  ? "Fee record contains payment history"
                  : "This action cannot be undone"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Paid > 0 Warning Banner */}
        {hasPayment ? (
          <div className="mt-4 rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <Ban className="h-4 w-4 shrink-0 text-amber-700" />
              <span>Cannot Cancel: Payment Already Logged</span>
            </div>
            <p className="leading-relaxed text-amber-800">
              This fee ledger has a recorded payment of{" "}
              <strong>NPR {paidAmount.toLocaleString()}</strong>. In accordance
              with accounting and audit rules, fee records with existing
              transactions cannot be cancelled.
            </p>
          </div>
        ) : (
          <div className="mt-4 rounded-xl bg-slate-50 border border-slate-100 p-3.5 text-xs text-slate-600">
            <p className="leading-relaxed">
              Are you sure you want to cancel this fee assignment for{" "}
              <strong className="text-slate-900">{studentName}</strong>? It will
              be permanently marked as <strong>CANCELLED</strong> in the ledger.
            </p>
          </div>
        )}

        {/* Student & Ledger Summary Details */}
        <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Student</span>
            <span className="font-semibold text-slate-900">
              {studentName} ({admissionNo})
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Fee Category</span>
            <span className="font-semibold text-slate-900">{feeType}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Total Assigned</span>
            <span className="font-semibold text-slate-900">
              NPR {totalAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Amount Paid</span>
            <span
              className={`font-semibold ${
                hasPayment ? "text-emerald-700" : "text-slate-600"
              }`}
            >
              NPR {paidAmount.toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between pt-1 border-t border-slate-200 font-bold">
            <span className="text-slate-700">Remaining Due</span>
            <span className="text-rose-600">
              NPR {dueAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="mt-6 flex justify-end gap-2.5 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
          >
            {hasPayment ? "Close" : "Keep Fee"}
          </button>

          {!hasPayment && (
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 disabled:opacity-50 transition-colors shadow-xs cursor-pointer"
            >
              {isLoading ? "Cancelling..." : "Confirm Cancel"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentFeeCancelModal;
