import React, { useState, useEffect } from "react";
import { X, CreditCard, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { useInitiateEsewaPayment } from "../../features/payments/payment.hooks";
import { formatCurrency } from "../../utils/formatCurrency";

function EsewaPayModal({ open, onClose, studentFee }) {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const { mutate: initiateEsewa, isPending } = useInitiateEsewaPayment();

  useEffect(() => {
    if (studentFee?.dueAmount) {
      setAmount(studentFee.dueAmount.toString());
      setError("");
    }
  }, [studentFee]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open && !isPending) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, isPending, onClose]);

  if (!open || !studentFee) return null;

  const dueAmount = studentFee.dueAmount || 0;
  const feeTitle =
    studentFee.feeStructureId?.name ||
    studentFee.feeStructureId?.feeType ||
    "Fee Payment";

  const handlePay = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);

    if (!numAmount || numAmount <= 0) {
      setError("Please enter a valid payment amount");
      return;
    }

    if (numAmount > dueAmount) {
      setError(
        `Payment amount cannot exceed the due amount (${formatCurrency(dueAmount)})`,
      );
      return;
    }

    setError("");

    initiateEsewaPaymentServiceSubmit({
      studentFeeId: studentFee._id,
      amount: numAmount,
    });
  };

  const initiateEsewaPaymentServiceSubmit = (payload) => {
    initiateEsewa(payload, {
      onSuccess: (response) => {
        const { paymentUrl, paymentData } = response;
        if (!paymentUrl || !paymentData) {
          setError("Failed to initialize payment gateway parameters");
          return;
        }

        // Dynamically create and submit eSewa POST form
        const form = document.createElement("form");
        form.setAttribute("method", "POST");
        form.setAttribute("action", paymentUrl);
        form.style.display = "none";

        Object.entries(paymentData).forEach(([key, value]) => {
          const hiddenField = document.createElement("input");
          hiddenField.setAttribute("type", "hidden");
          hiddenField.setAttribute("name", key);
          hiddenField.setAttribute("value", value);
          form.appendChild(hiddenField);
        });

        document.body.appendChild(form);
        form.submit();
      },
      onError: (err) => {
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to initiate eSewa payment. Please try again.";
        setError(msg);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={!isPending ? onClose : undefined}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 transition-all animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 font-poppins">
              Pay with eSewa
            </h2>
            <p className="text-xs text-slate-500">
              Fast & secure online fee payment
            </p>
          </div>
        </div>

        {/* Fee Summary Box */}
        <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 mb-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Fee Item:</span>
            <span className="font-semibold text-slate-900">{feeTitle}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Total Payable:</span>
            <span className="font-medium text-slate-900">
              {formatCurrency(studentFee.netAmount ?? studentFee.finalAmount)}
            </span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Already Paid:</span>
            <span className="font-medium text-emerald-600">
              {formatCurrency(studentFee.paidAmount || 0)}
            </span>
          </div>
          <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200">
            <span className="font-semibold text-slate-900">Due Balance:</span>
            <span className="font-bold text-rose-600 font-poppins text-sm">
              {formatCurrency(dueAmount)}
            </span>
          </div>
        </div>

        {/* Payment Amount Input Form */}
        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label
              htmlFor="esewa-amount"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5"
            >
              Payment Amount (रू)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-semibold text-slate-400">
                रू
              </span>
              <input
                id="esewa-amount"
                type="number"
                min="1"
                max={dueAmount}
                step="any"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                disabled={isPending}
                placeholder="Enter amount"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-8 pr-4 text-sm font-semibold text-slate-900 shadow-2xs focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-100"
                required
              />
            </div>
            <p className="mt-1 text-[11px] text-slate-400">
              You can pay the full amount or a partial installment up to{" "}
              {formatCurrency(dueAmount)}.
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg bg-rose-50 p-2.5 text-xs text-rose-700 border border-rose-200">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              You will be redirected to eSewa's secure payment gateway.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending || !Number(amount)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Connecting to eSewa...</span>
                </>
              ) : (
                <span>
                  Pay {amount ? formatCurrency(Number(amount)) : ""} with eSewa
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EsewaPayModal;
