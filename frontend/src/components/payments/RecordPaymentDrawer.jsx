import { useState } from "react";
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
import {
  useCreateOfflinePayment,
  usePaymentStudentFees,
} from "../../features/payments/payment.hooks";

const getPaymentErrorMessage = (error) => {
  const status = error.response?.status;
  const message = error.response?.data?.message || "";

  if (message === "Transaction ID already exists") {
    return "This transaction or cheque number has already been used. Please check it or enter a different number.";
  }

  if (message.includes("due amount has changed")) {
    return "The outstanding balance has changed. Please search for and select the student fee again before recording the payment.";
  }

  if (message === "Cannot make payment for a cancelled student fee") {
    return "This fee has been cancelled and can no longer receive a payment.";
  }

  if (message === "Student fee not found" || status === 404) {
    return "This student fee is no longer available. Please search for the student again.";
  }

  if (status === 401 || status === 403) {
    return "You do not have permission to record this payment. Please sign in again or contact an administrator.";
  }

  if (!error.response) {
    return "Could not reach the server. Check your internet connection and try again.";
  }

  return "The payment could not be recorded. Please review the details and try again.";
};

const RecordPaymentDrawer = ({ onClose }) => {
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudentFee, setSelectedStudentFee] = useState(null);
  const [amount, setAmount] = useState("");
  const [reference, setReference] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [remarks, setRemarks] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [createdPayment, setCreatedPayment] = useState(null);
  const debouncedStudentSearch = useDebounce(studentSearch);
  const { mutateAsync: createOfflinePayment, isPending: isCreatingPayment } =
    useCreateOfflinePayment();

  const {
    data: studentFeeSearch,
    isLoading: isStudentFeesLoading,
    isFetching: isStudentFeesFetching,
    isError: isStudentFeesError,
  } = usePaymentStudentFees({
    search: debouncedStudentSearch,
    limit: 10,
  });

  const hasSearchTerm = Boolean(studentSearch.trim());
  const studentFees = (studentFeeSearch?.studentFees ?? []).filter(
    (studentFee) =>
      studentFee.status !== "CANCELLED" && Number(studentFee.dueAmount) > 0,
  );
  const outstandingBalance = Number(selectedStudentFee?.dueAmount ?? 0);
  const isAmountValid =
    amount.trim() !== "" &&
    Number(amount) > 0 &&
    Number(amount) <= (selectedStudentFee?.dueAmount ?? 0);
  const canSubmit =
    Boolean(selectedStudentFee) &&
    isAmountValid &&
    Boolean(paymentMethod) &&
    !createdPayment;

  const selectStudentFee = (studentFee) => {
    setSelectedStudentFee(studentFee);
    setAmount("");
    setStudentSearch("");
    setSubmitError("");
    setCreatedPayment(null);
  };

  const handleRecordPayment = async () => {
    if (!canSubmit || isCreatingPayment) return;

    setSubmitError("");

    try {
      const payment = await createOfflinePayment({
        studentFeeId: selectedStudentFee._id,
        amount: Number(amount),
        paymentMethod,
        transactionId:
          paymentMethod === "CASH" ? undefined : reference.trim() || undefined,
        remarks: remarks.trim() || undefined,
      });
      setCreatedPayment(payment);
    } catch (error) {
      setSubmitError(getPaymentErrorMessage(error));
    }
  };
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
                    value={studentSearch}
                    onChange={(event) => setStudentSearch(event.target.value)}
                    placeholder="Search by student name or ID"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5"
                  />
                  <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>

                {/* Search Results */}
                {hasSearchTerm && (
                  <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
                    {isStudentFeesLoading || isStudentFeesFetching ? (
                      <div className="space-y-3 p-3.5 animate-pulse">
                        {[1, 2].map((item) => (
                          <div key={item} className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-slate-200" />
                            <div className="flex-1 space-y-2">
                              <div className="h-3 w-1/3 rounded bg-slate-200" />
                              <div className="h-2.5 w-2/3 rounded bg-slate-100" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : isStudentFeesError ? (
                      <p className="px-3.5 py-4 text-center text-xs text-rose-600">
                        Could not load matching student fees. Please try again.
                      </p>
                    ) : studentFees.length === 0 ? (
                      <p className="px-3.5 py-4 text-center text-xs text-slate-500">
                        No outstanding student fees found for “{studentSearch.trim()}”.
                      </p>
                    ) : (
                      studentFees.map((studentFee, index) => {
                        const student = studentFee.studentId;
                        const name = student?.name ?? "Unknown student";
                        const initials = name
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((part) => part[0])
                          .join("")
                          .toUpperCase();

                        return (
                          <button
                            key={studentFee._id}
                            type="button"
                            onClick={() => selectStudentFee(studentFee)}
                            className={`flex w-full items-center gap-3 px-3.5 py-3 text-left transition hover:bg-slate-50 ${
                              index > 0 ? "border-t border-slate-100" : ""
                            }`}
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                              {initials || "S"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-900">{name}</p>
                              <p className="truncate text-xs text-slate-500">
                                ID: {student?.admissionNumber ?? "N/A"} · {studentFee.feeStructureId?.feeType ?? "Fee"}
                              </p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Due</p>
                              <p className="text-sm font-semibold text-slate-900">
                                Rs. {Number(studentFee.dueAmount ?? 0).toLocaleString("en-IN")}
                              </p>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                )}
                {/* Selected student preview */}
                {selectedStudentFee && (
                  <div className="mt-3 flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold tracking-wide text-white">
                      {selectedStudentFee.studentId?.name
                        ?.split(" ")
                        .filter(Boolean)
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")
                        .toUpperCase() || "S"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900">
                        {selectedStudentFee.studentId?.name ?? "Unknown student"}
                      </p>
                      <p className="truncate text-xs text-slate-500">
                        {selectedStudentFee.feeStructureId?.feeType ?? "Fee"} · ID: {selectedStudentFee.studentId?.admissionNumber ?? "N/A"}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Outstanding
                      </p>
                      <p className="text-sm font-semibold text-slate-900">
                        Rs. {outstandingBalance.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                )}
                {!selectedStudentFee && (
                  <p className="mt-2 text-xs text-slate-400">
                    Select a student fee to continue.
                  </p>
                )}
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
                      min="0"
                      max={selectedStudentFee ? outstandingBalance : undefined}
                      step="0.01"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder={
                        selectedStudentFee
                          ? outstandingBalance.toLocaleString("en-IN")
                          : "Select a student fee"
                      }
                      disabled={!selectedStudentFee}
                      className={`h-11 w-full rounded-xl border bg-white pl-8 pr-3.5 text-sm font-semibold text-slate-900 shadow-sm outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:ring-4 ${
                        amount && !isAmountValid
                          ? "border-rose-300 focus:border-rose-400 focus:ring-rose-500/5"
                          : "border-slate-200 focus:border-slate-400 focus:ring-slate-900/5"
                      }`}
                    />
                  </div>

                  <p className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
                    <span>Outstanding balance</span>
                    <span className="font-semibold text-slate-700">
                      Rs. {outstandingBalance.toLocaleString("en-IN")}
                    </span>
                  </p>
                  {amount && Number(amount) <= 0 && (
                    <p className="mt-1.5 text-xs text-rose-500">
                      Amount must be greater than zero.
                    </p>
                  )}
                  {amount && Number(amount) > outstandingBalance && (
                    <p className="mt-1.5 text-xs text-rose-500">
                      Amount cannot exceed the outstanding balance.
                    </p>
                  )}
                </div>

                {/* Transaction / Cheque No */}
                {paymentMethod !== "CASH" && (
                <div>
                  <label
                    htmlFor="reference"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Transaction / Cheque No.
                  </label>

                  <div className="relative">
                    <Hash className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      id="reference"
                      type="text"
                      value={reference}
                      onChange={(event) => setReference(event.target.value)}
                      placeholder="e.g. NBL-894321"
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-900/5"
                    />
                  </div>

                  <p className="mt-1.5 text-xs text-slate-500">
                    {paymentMethod === "BANK_TRANSFER"
                        ? "Enter the bank transaction number."
                        : "Enter the cheque number."}
                  </p>
                </div>
                )}

                {/* Payment method */}
                <div>
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">
                    Payment Method <span className="text-rose-500">*</span>
                  </span>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod("CASH");
                        setReference("");
                      }}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left shadow-sm transition ${
                        paymentMethod === "CASH"
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
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
                      onClick={() => setPaymentMethod("BANK_TRANSFER")}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left shadow-sm transition ${
                        paymentMethod === "BANK_TRANSFER"
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
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
                      onClick={() => setPaymentMethod("CHEQUE")}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left shadow-sm transition ${
                        paymentMethod === "CHEQUE"
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                      }`}
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
                      value={remarks}
                      onChange={(event) => setRemarks(event.target.value)}
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
          {submitError && (
            <p className="mb-3 text-right text-xs text-rose-600" role="alert">
              {submitError}
            </p>
          )}
          {createdPayment && (
            <div className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
              <p className="font-semibold">Payment recorded successfully.</p>
              <dl className="mt-2 space-y-1">
                <div className="flex justify-between gap-3">
                  <dt className="text-emerald-700">Payment Reference</dt>
                  <dd className="font-mono font-medium">
                    {createdPayment.paymentReference}
                  </dd>
                </div>
                {createdPayment.paymentMethod !== "CASH" && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-emerald-700">Transaction / Cheque No.</dt>
                    <dd className="font-mono font-medium">
                      {createdPayment.transactionId || "—"}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-3">
                  <dt className="text-emerald-700">Receipt No.</dt>
                  <dd className="font-mono font-medium">
                    {createdPayment.receiptNumber}
                  </dd>
                </div>
              </dl>
            </div>
          )}
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
                disabled={!canSubmit || isCreatingPayment}
                onClick={handleRecordPayment}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-2 ${
                  canSubmit && !isCreatingPayment
                    ? "bg-slate-900 text-white hover:bg-slate-800"
                    : "cursor-not-allowed bg-slate-200 text-slate-400"
                }`}
              >
                <Check className="h-4 w-4" />
                {isCreatingPayment
                  ? "Recording..."
                  : createdPayment
                    ? "Payment Recorded"
                    : "Record Payment"}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default RecordPaymentDrawer;
