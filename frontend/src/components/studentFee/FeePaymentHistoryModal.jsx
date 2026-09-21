import React, { useState, useEffect } from "react";
import {
  X,
  CreditCard,
  Download,
  Loader2,
  Calendar,
  CheckCircle,
  Receipt,
} from "lucide-react";
import {
  useStudentFeePayments,
  useDownloadPaymentReceipt,
} from "../../features/payments/payment.hooks";
import { formatCurrency } from "../../utils/formatCurrency";

function FeePaymentHistoryModal({ open, onClose, studentFee }) {
  const { data: payments = [], isLoading } = useStudentFeePayments(
    open ? studentFee?._id : null,
  );
  const { mutate: downloadReceipt } = useDownloadPaymentReceipt();
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open || !studentFee) return null;

  const handleDownload = (paymentId, receiptNumber) => {
    setDownloadingId(paymentId);
    downloadReceipt(paymentId, {
      onSuccess: ({ blob, receiptNumber: num }) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute(
          "download",
          `Receipt-${num || receiptNumber || paymentId}.pdf`,
        );
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        setDownloadingId(null);
      },
      onError: () => {
        setDownloadingId(null);
      },
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatMethod = (method) => {
    if (!method) return "-";
    if (method === "BANK_TRANSFER") return "Bank Transfer";
    if (method === "ESEWA") return "eSewa";
    if (method === "KHALTI") return "Khalti";
    if (method === "CASH") return "Cash";
    if (method === "CHEQUE") return "Cheque";
    return method;
  };

  const feeTitle =
    studentFee.feeStructureId?.name ||
    studentFee.feeStructureId?.feeType ||
    "Fee Payment History";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-2xl border border-slate-100 transition-all animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-blue-500/20">
            <Receipt className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 font-poppins">
              Payment History
            </h2>
            <p className="text-xs text-slate-500">{feeTitle}</p>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 py-10 text-center bg-slate-50/50">
            <CreditCard className="h-8 w-8 text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-700">
              No payments found
            </p>
            <p className="text-xs text-slate-400 mt-1">
              No payments have been recorded for this fee ledger yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4">Receipt / TXN</th>
                  <th className="pb-3 pr-4">Method</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-roboto text-xs">
                {payments.map((p) => {
                  const isDownloadingThis = downloadingId === p._id;

                  return (
                    <tr
                      key={p._id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3 pr-4 font-mono text-slate-800">
                        {p.transactionId || `TXN-${p._id.slice(-6)}`}
                      </td>
                      <td className="py-3 pr-4 font-medium text-slate-700">
                        {formatMethod(p.paymentMethod)}
                      </td>
                      <td className="py-3 pr-4 font-semibold font-poppins text-slate-900">
                        {formatCurrency(p.amount)}
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ring-inset ${
                            p.paymentStatus === "SUCCESS"
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                              : p.paymentStatus === "PENDING"
                                ? "bg-amber-50 text-amber-700 ring-amber-600/20"
                                : "bg-rose-50 text-rose-700 ring-rose-600/20"
                          }`}
                        >
                          {p.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-slate-500 text-[11px]">
                        {formatDate(p.paidAt || p.createdAt)}
                      </td>
                      <td className="py-3 text-right">
                        {p.paymentStatus === "SUCCESS" ? (
                          <button
                            type="button"
                            onClick={() => handleDownload(p._id)}
                            disabled={isDownloadingThis}
                            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-2xs disabled:opacity-50"
                          >
                            {isDownloadingThis ? (
                              <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                            ) : (
                              <Download className="h-3 w-3 text-slate-500" />
                            )}
                            <span>Receipt</span>
                          </button>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 flex justify-end pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default FeePaymentHistoryModal;
