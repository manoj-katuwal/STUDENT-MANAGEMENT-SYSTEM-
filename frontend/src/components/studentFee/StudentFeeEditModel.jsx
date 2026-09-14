import { useEffect, useState } from "react";
import { X, AlertCircle, Info, Sparkles, CheckCircle2 } from "lucide-react";

const StudentFeeEditModal = ({
  studentFee,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [discountAmount, setDiscountAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (studentFee) {
      setDiscountAmount(studentFee.discountAmount ?? 0);
      setError("");
    }
  }, [studentFee]);

  if (!studentFee) return null;

  const totalAmount = studentFee.totalAmount ?? 0;
  const currentDiscount = studentFee.discountAmount ?? 0;
  const paidAmount = studentFee.paidAmount ?? 0;

  // Max discount allowable so that netAmount (total - discount) >= paidAmount
  const maxAllowedDiscount = Math.max(0, totalAmount - paidAmount);

  // Fully paid restriction
  const isFullyPaid = paidAmount >= totalAmount && totalAmount > 0;
  const hasPartialPayment = paidAmount > 0 && !isFullyPaid;

  const numericDiscount = Number(discountAmount) || 0;
  const newNetAmount = Math.max(0, totalAmount - numericDiscount);
  const newDueAmount = Math.max(0, newNetAmount - paidAmount);

  const handleDiscountChange = (val) => {
    setDiscountAmount(val);
    const num = Number(val) || 0;

    if (num < 0) {
      setError("Discount cannot be negative.");
    } else if (num > maxAllowedDiscount) {
      setError(
        `Discount cannot exceed NPR ${maxAllowedDiscount.toLocaleString()} (Total minus Paid amount).`,
      );
    } else {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFullyPaid) return;

    if (numericDiscount < 0 || numericDiscount > maxAllowedDiscount) {
      setError(
        `Discount must be between 0 and NPR ${maxAllowedDiscount.toLocaleString()}.`,
      );
      return;
    }

    onSubmit({ discountAmount: numericDiscount });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Adjust Concession / Discount
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Update fee concession for this student ledger.
            </p>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Fully Paid Warning */}
          {isFullyPaid && (
            <div className="flex items-start gap-2.5 rounded-xl bg-slate-50 border border-slate-200 p-3 text-slate-800 text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold block">Fully Settled</span>
                This fee record is already 100% paid (NPR{" "}
                {paidAmount.toLocaleString()}). Concession cannot be adjusted.
              </div>
            </div>
          )}

          {/* Partial Payment Notice */}
          {hasPartialPayment && (
            <div className="flex items-start gap-2.5 rounded-xl bg-blue-50 border border-blue-200 p-3 text-blue-900 text-xs">
              <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold block">
                  Partial Payment Exists
                </span>
                Already Paid: <strong>NPR {paidAmount.toLocaleString()}</strong>
                . Maximum allowable discount is{" "}
                <strong>NPR {maxAllowedDiscount.toLocaleString()}</strong>.
              </div>
            </div>
          )}

          {/* Student Info Box */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3.5 border border-slate-100 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Student
              </span>
              <p className="text-sm font-semibold text-slate-900 mt-0.5">
                {studentFee.studentId?.name ?? "—"}
              </p>
              <span className="text-[11px] font-mono text-slate-500">
                {studentFee.studentId?.admissionNumber ?? "—"}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block">
                Base Fee
              </span>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                NPR {totalAmount.toLocaleString()}
              </p>
              <span className="text-[11px] text-emerald-600 font-medium">
                Paid: NPR {paidAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Input Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label
                htmlFor="discountAmount"
                className="text-xs font-semibold text-slate-700"
              >
                Discount Amount (NPR)
              </label>
              <span className="text-[11px] text-slate-400 font-medium">
                Max: NPR {maxAllowedDiscount.toLocaleString()}
              </span>
            </div>
            <input
              id="discountAmount"
              type="number"
              min="0"
              max={maxAllowedDiscount}
              disabled={isFullyPaid}
              value={discountAmount}
              onChange={(e) => handleDiscountChange(e.target.value)}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm font-medium outline-none transition-all placeholder:text-slate-400 ${
                isFullyPaid
                  ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                  : error
                    ? "bg-rose-50 border-rose-300 text-rose-900 focus:ring-2 focus:ring-rose-100"
                    : "bg-white border-slate-300 text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
              }`}
              placeholder="0"
            />
            {error && (
              <p className="mt-1.5 text-xs text-rose-600 font-medium flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </p>
            )}
          </div>

          {/* Breakdown Card */}
          <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2 text-xs">
            <div className="flex justify-between text-slate-500">
              <span>Current Discount</span>
              <span className="font-semibold text-slate-700">
                NPR {currentDiscount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-emerald-500" />
                New Discount
              </span>
              <span className="font-semibold text-emerald-600">
                + NPR {numericDiscount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>New Net Payable</span>
              <span className="font-semibold text-slate-900">
                NPR {newNetAmount.toLocaleString()}
              </span>
            </div>
            <div className="border-t border-slate-200 pt-2 mt-2 flex justify-between text-xs font-bold">
              <span className="text-slate-800">Remaining Due Balance</span>
              <span className="text-rose-600 font-mono text-sm">
                NPR {newDueAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFullyPaid || Boolean(error) || isLoading}
              className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-colors shadow-xs cursor-pointer ${
                isFullyPaid || Boolean(error) || isLoading
                  ? "bg-slate-300 cursor-not-allowed text-slate-500 shadow-none"
                  : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800"
              }`}
            >
              {isLoading ? "Saving..." : "Save Discount"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFeeEditModal;
