import React, { useEffect } from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
  Hash,
  GraduationCap,
  X,
  Printer,
  Receipt,
  Building2,
} from "lucide-react";

const StudentFeeViewModel = ({ studentFee, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && studentFee) {
        onClose?.();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [studentFee, onClose]);

  useEffect(() => {
    if (studentFee) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [studentFee]);

  if (!studentFee) return null;

  const studentName = studentFee?.studentId?.name || "N/A";
  const admissionNo = studentFee?.studentId?.admissionNumber || "—";
  const academicYear = studentFee?.academicYearId?.name || "—";
  const feeType = studentFee?.feeStructureId?.feeType || "Academic Fee";
  const dueDate = studentFee?.dueDate
    ? new Date(studentFee.dueDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";
  const invoiceNo = studentFee?._id
    ? `INV-${studentFee._id.slice(-8).toUpperCase()}`
    : "—";
  const status = studentFee?.status || "PENDING";

  const totalAmount = studentFee?.totalAmount ?? 0;
  const discountAmount = studentFee?.discountAmount ?? 0;
  const scholarshipAmount = studentFee?.scholarshipAmount ?? 0;
  const fineAmount = studentFee?.fineAmount ?? 0;
  const netAmount = studentFee?.netAmount ?? 0;
  const paidAmount = studentFee?.paidAmount ?? 0;
  const dueAmount = studentFee?.dueAmount ?? 0;

  const getStatusConfig = (currentStatus) => {
    switch (currentStatus) {
      case "PAID":
        return {
          label: "Paid",
          badge:
            "bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-500/10",
          icon: CheckCircle2,
        };
      case "PARTIAL":
        return {
          label: "Partially Paid",
          badge:
            "bg-amber-50 text-amber-700 border-amber-200/80 ring-amber-500/10",
          icon: Clock,
        };
      case "PENDING":
        return {
          label: "Unpaid",
          badge: "bg-rose-50 text-rose-700 border-rose-200/80 ring-rose-500/10",
          icon: Clock,
        };
      case "CANCELLED":
        return {
          label: "Cancelled",
          badge:
            "bg-slate-100 text-slate-600 border-slate-200 ring-slate-500/10",
          icon: XCircle,
        };
      default:
        return {
          label: currentStatus,
          badge:
            "bg-slate-100 text-slate-600 border-slate-200 ring-slate-500/10",
          icon: Clock,
        };
    }
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;
  const studentInitial = studentName.charAt(0).toUpperCase() || "S";

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 print:p-0 print:static print:bg-white">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity print:hidden"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Student Fee Details"
        className="relative z-10 w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-slate-100 text-slate-900 print:max-h-none print:shadow-none print:border-none print:w-full"
      >
        {/* Top Header Actions */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur-md print:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Receipt className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Fee Voucher Statement
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 active:scale-95 transition-all"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Print Invoice</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Identity Info Card */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 font-semibold text-lg text-white shadow-xs">
                  {studentInitial}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {studentName}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Hash className="h-3 w-3 text-slate-400" />
                      ID: {admissionNo}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                      Year {academicYear}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center border-t sm:border-t-0 border-slate-200/60 pt-3 sm:pt-0">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border ring-1 ${statusConfig.badge}`}
                >
                  <StatusIcon className="h-3.5 w-3.5" />
                  {statusConfig.label}
                </span>
                <span className="text-[11px] font-mono text-slate-400 mt-1">
                  {invoiceNo}
                </span>
              </div>
            </div>

            {/* Meta Attributes Table */}
            <div className="mt-4 grid grid-cols-2 gap-4 pt-3.5 border-t border-slate-200/70 text-xs">
              <div>
                <span className="text-slate-400 font-medium block">
                  Fee Type
                </span>
                <span className="font-semibold text-slate-700 mt-0.5 block">
                  {feeType}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block">
                  Due Date
                </span>
                <span className="font-semibold text-slate-700 mt-0.5 block">
                  {dueDate}
                </span>
              </div>
            </div>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                Net Payable
              </span>
              <p className="mt-1.5 text-xl font-bold text-slate-900 tracking-tight">
                NPR {netAmount.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-800/70 block">
                Paid Amount
              </span>
              <p className="mt-1.5 text-xl font-bold text-emerald-700 tracking-tight">
                NPR {paidAmount.toLocaleString()}
              </p>
            </div>

            <div className="rounded-xl border border-rose-100 bg-rose-50/40 p-4 shadow-2xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-800/70 block">
                Balance Due
              </span>
              <p className="mt-1.5 text-xl font-bold text-rose-600 tracking-tight">
                NPR {dueAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Detailed Ledger Section */}
          <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Payment Breakdown
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                Currency: NPR
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-slate-600 font-medium">
                  Base Fee Amount
                </span>
                <span className="font-medium text-slate-900">
                  NPR {totalAmount.toLocaleString()}
                </span>
              </div>

              {discountAmount > 0 && (
                <div className="flex items-center justify-between px-4 py-3 bg-emerald-50/20">
                  <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                    Concession / Discount
                  </span>
                  <span className="font-semibold text-emerald-700">
                    - NPR {discountAmount.toLocaleString()}
                  </span>
                </div>
              )}

              {scholarshipAmount > 0 && (
                <div className="flex items-center justify-between px-4 py-3 bg-emerald-50/20">
                  <span className="text-emerald-700 font-medium">
                    Scholarship Concession
                  </span>
                  <span className="font-semibold text-emerald-700">
                    - NPR {scholarshipAmount.toLocaleString()}
                  </span>
                </div>
              )}

              {fineAmount > 0 && (
                <div className="flex items-center justify-between px-4 py-3 bg-rose-50/20">
                  <span className="text-rose-700 font-medium">
                    Late Fee / Fine
                  </span>
                  <span className="font-semibold text-rose-700">
                    + NPR {fineAmount.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between px-4 py-3 bg-slate-50/60 font-semibold text-slate-900 border-t border-slate-200">
                <span>Net Payable Amount</span>
                <span>NPR {netAmount.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-slate-600 font-medium">
                  Amount Received
                </span>
                <span className="font-semibold text-emerald-600">
                  - NPR {paidAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center justify-between px-4 py-3.5 bg-slate-900 text-white font-bold">
                <span className="text-xs tracking-wider uppercase font-semibold text-slate-300">
                  Remaining Outstanding
                </span>
                <span className="text-base text-rose-400">
                  NPR {dueAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/50 px-6 py-3.5 print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 active:scale-95 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeViewModel;
