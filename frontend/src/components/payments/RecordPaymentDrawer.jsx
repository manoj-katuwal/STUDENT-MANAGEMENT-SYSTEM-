import React from "react";
import {
  X,
  CreditCard,
  Search,
  ChevronDown,
  Hash,
  StickyNote,
  Banknote,
  Landmark,
  ScrollText,
  Check,
} from "lucide-react";
import useDebounce from "../../hooks/useDebounce";
import { usePaymentStudentFees } from "../../features/payments/payment.hooks";

const RecordPaymentDrawer = ({ onClose }) => {
  const { data: studentFeeData, isLoading: isStudentFeesLoading } =
    usePaymentStudentFees({
      search: useDebounce,
    });
  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-white shadow-2xl ring-1 ring-slate-900/5">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-900 shadow-sm">
              <CreditCard className="h-5 w-5 text-white" />
            </div>

            <div>
              <h2 className="text-base font-semibold tracking-tight text-slate-900">
                Record Payment
              </h2>
              <p className="mt-0.5 text-sm text-slate-500">
                Record an offline student payment
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 px-6 py-6">
          <div className="space-y-5">
            {/* Student Fee */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600">
                  1
                </span>
                <h3 className="text-sm font-semibold text-slate-900">
                  Student Fee
                </h3>
              </div>
              <p className="mt-1.5 pl-8.5 text-xs text-slate-500">
                Select the student fee for this payment.
              </p>

              <div className="mt-4">
                <label
                  htmlFor="student"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Student <span className="text-rose-500">*</span>
                </label>

                <div className="relative">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    id="student"
                    type="text"
                    placeholder="Search by student name or ID"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5"
                  />
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>

                {/* Search Results */}
                <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition hover:bg-slate-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                      AS
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        Aarav Sharma
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        ID: STU-2041 · Grade 10 · Section A
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Due
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        Rs. 450.00
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    className="flex w-full items-center gap-3 border-t border-slate-100 px-3.5 py-3 text-left transition hover:bg-slate-50"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
                      SK
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        Soma Katwal
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        ID: INT-TEST-002 · Grade 10 · Section L1C4
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Due
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        Rs. 1,200.00
                      </p>
                    </div>
                  </button>
                </div>

                {/* Selected student preview */}
                <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold tracking-wide text-white">
                    AS
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-900">
                      Aarav Sharma
                    </p>
                    <p className="truncate text-xs text-slate-500">
                      Grade 10 · Section A · ID: STU-2041
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      Outstanding
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      Rs. 450.00
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Details */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600">
                  2
                </span>
                <h3 className="text-sm font-semibold text-slate-900">
                  Payment Details
                </h3>
              </div>
              <p className="mt-1.5 pl-8.5 text-xs text-slate-500">
                Enter the payment information.
              </p>

              <div className="mt-4 space-y-4">
                {/* Amount */}
                <div>
                  <label
                    htmlFor="amount"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Amount <span className="text-rose-500">*</span>
                  </label>

                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
                      Rs.
                    </span>
                    <input
                      id="amount"
                      type="number"
                      inputMode="decimal"
                      placeholder="0.00"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-8 pr-3.5 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5"
                    />
                  </div>

                  <p className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
                    <span>Outstanding balance</span>
                    <span className="font-semibold text-slate-700">
                      Rs. 450.00
                    </span>
                  </p>
                </div>

                {/* Reference No */}
                <div>
                  <label
                    htmlFor="reference"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Reference No.
                  </label>

                  <div className="relative">
                    <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="reference"
                      type="text"
                      placeholder="e.g. TXN-88213"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5"
                    />
                  </div>

                  <p className="mt-1.5 text-xs text-slate-500">
                    Optional for cash payments.
                  </p>
                </div>

                {/* Payment method */}
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Payment Method <span className="text-rose-500">*</span>
                  </span>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      className="flex items-center gap-3 rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-left text-white shadow-sm transition"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
                        <Banknote className="h-4 w-4 text-white" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold">
                          Cash
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-slate-300">
                          Physical payment
                        </span>
                      </span>

                      <Check className="h-4 w-4 shrink-0 text-white" />
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <Landmark className="h-4 w-4 text-slate-600" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold">
                          Bank Transfer
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-slate-400">
                          Direct bank payment
                        </span>
                      </span>
                    </button>

                    <button
                      type="button"
                      className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <ScrollText className="h-4 w-4 text-slate-600" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-semibold">
                          Cheque
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-slate-400">
                          Cheque payment
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Additional Information */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-[11px] font-semibold text-slate-600">
                  3
                </span>
                <h3 className="text-sm font-semibold text-slate-900">
                  Additional Information
                </h3>
              </div>
              <p className="mt-1.5 pl-8.5 text-xs text-slate-500">
                Add optional transaction details.
              </p>

              <div className="mt-4 space-y-4">
                <div>
                  <label
                    htmlFor="notes"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Notes
                  </label>

                  <div className="relative">
                    <StickyNote className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <textarea
                      id="notes"
                      rows={3}
                      maxLength={500}
                      placeholder="Add any notes about this payment..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">
                    Optional · Maximum 500 characters
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                Total Amount
              </p>
              <p className="text-sm font-semibold text-slate-900">Rs. 0.00</p>
            </div>

            <div className="flex flex-1 items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled
                className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl bg-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-400 shadow-sm"
              >
                <Check className="h-4 w-4" />
                Record Payment
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default RecordPaymentDrawer;
