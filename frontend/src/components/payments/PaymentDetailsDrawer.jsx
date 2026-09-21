import { useEffect, useState } from "react";
import {
  X,
  User,
  Receipt,
  CalendarDays,
  Hash,
  Wallet,
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  Clock,
  XCircle,
  RefreshCw,
  RotateCcw,
  Download,
  CreditCard,
} from "lucide-react";
import {
  useDownloadReceiptPdf,
  usePayment,
  useReceiptByPaymentId,
  useReversePayment,
} from "../../features/payments/payment.hooks";

const formatAmount = (amount) =>
  `Rs. ${Number(amount ?? 0).toLocaleString("en-IN")}`;

const formatDate = (date, includeTime = false) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    ...(includeTime && { hour: "numeric", minute: "2-digit" }),
  });
};

const getStatusBadge = (status = "") => {
  const upperStatus = status.toUpperCase();
  switch (upperStatus) {
    case "SUCCESS":
    case "PAID":
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          {status}
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
          <Clock className="h-3.5 w-3.5 text-amber-600" />
          {status}
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
          <XCircle className="h-3.5 w-3.5 text-rose-600" />
          {status}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-500/10">
          {status || "N/A"}
        </span>
      );
  }
};

const PaymentDetailsDrawer = ({ onClose, paymentId }) => {
  const { data: payment, isLoading, isError, refetch } = usePayment(paymentId);
  const { data: receipt, isLoading: isReceiptLoading } =
    useReceiptByPaymentId(paymentId);
  const { mutateAsync: downloadReceipt, isPending: isDownloading } =
    useDownloadReceiptPdf();


  const { mutate: reversePayment, isPending: isReversing } =
    useReversePayment();
  const [isReverseDialogOpen, setIsReverseDialogOpen] = useState(false);
  const [reverseReason, setReverseReason] = useState("");
  const [reverseError, setReverseError] = useState("");

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;

      if (isReverseDialogOpen) {
        if (!isReversing) setIsReverseDialogOpen(false);
        return;
      }

      onClose();
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isReverseDialogOpen, isReversing, onClose]);

  const studentFee = payment?.studentFeeId;
  const student = studentFee?.studentId;
  const feeStructure = studentFee?.feeStructureId;

  const downloadReceiptFile = async () => {
    if (!receipt?._id) return;
    try {
      const blob = await downloadReceipt(receipt._id);

      if (!blob || blob.size === 0) {
        throw new Error("Received an empty or invalid file.");
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `${receipt.receiptNumber || "receipt"}.pdf`;

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download receipt:", error);
    }
  };

  const closeReverseDialog = (force = false) => {
    if (isReversing && !force) return;

    setIsReverseDialogOpen(false);
    setReverseReason("");
    setReverseError("");
  };

  const handleReversePayment = () => {
    const reason = reverseReason.trim();

    if (reason.length < 5) {
      setReverseError("Please enter a reversal reason of at least 5 characters.");
      return;
    }

    setReverseError("");
    reversePayment(
      { paymentId, reason },
      {
        onSuccess: () => {
          closeReverseDialog(true);
          refetch();
        },
        onError: (error) => {
          setReverseError(
            error.response?.data?.message ||
              "Payment could not be reversed. Please try again.",
          );
        },
      },
    );
  };

  const renderContent = () => {
    // 1. Loading State
    if (isLoading) {
      return (
        <div className="space-y-5 animate-pulse">
          <div className="h-36 rounded-2xl bg-slate-200/80" />
          <div className="h-44 rounded-2xl bg-slate-200/80" />
          <div className="h-40 rounded-2xl bg-slate-200/80" />
        </div>
      );
    }

    // 2. Error State
    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-100 bg-rose-50/30 p-8 text-center my-auto">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h4 className="mt-3 text-sm font-bold text-slate-900">
            Failed to Load Details
          </h4>
          <p className="mt-1 text-xs text-slate-500 max-w-60">
            Something went wrong while fetching the payment information.
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition active:scale-95 shadow-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Try Again
          </button>
        </div>
      );
    }

    // 3. No Data Found
    if (!payment) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center my-auto">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Receipt className="h-6 w-6" />
          </div>
          <p className="mt-3 text-xs font-medium text-slate-500">
            No payment record found.
          </p>
        </div>
      );
    }

    // 4. Success / Data Render
    return (
      <div className="space-y-5">
        {/* Main Payment Card */}
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="border-b border-slate-100 bg-linear-to-b from-slate-50/80 to-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Total Paid Amount
                </span>
                <div className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                  {formatAmount(payment.amount)}
                </div>
              </div>
              {getStatusBadge(payment.paymentStatus)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-5 text-xs">
            <DetailItem
              label="Payment Method"
              value={payment.paymentMethod}
              icon={CreditCard}
            />
            <DetailItem label="Payment Type" value={payment.paymentType} />
            <DetailItem
              label="Payment Date"
              value={formatDate(payment.paidAt ?? payment.createdAt, true)}
            />
            <DetailItem
              label="Payment Reference"
              value={payment.paymentReference}
              mono
            />
            {payment.paymentMethod !== "CASH" && (
              <DetailItem
                label="Transaction / Cheque No."
                value={payment.transactionId}
                mono
              />
            )}
          </div>
        </section>

        {/* Student Profile Section */}
        <Section title="Student Profile" icon={User}>
          <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white shadow-xs">
              {student?.name?.slice(0, 2).toUpperCase() ?? "N/A"}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {student?.name ?? "N/A"}
              </h4>
              <p className="mt-0.5 text-xs text-slate-500 flex items-center gap-1.5">
                <span>Admission ID:</span>
                <span className="font-mono font-medium text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">
                  {student?.admissionNumber ?? "N/A"}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
            <DetailItem
              label="Academic Year"
              value={studentFee?.academicYearId?.name}
            />
            <DetailItem label="Class / Grade" value={student?.classId?.name} />
          </div>
        </Section>

        {/* Fee Breakdown Section */}
        <Section title="Fee Details" icon={GraduationCap}>
          <div className="space-y-3 text-xs">
            <Row label="Fee Type" value={feeStructure?.feeType} />
            <Row
              label="Total Fee Structure"
              value={formatAmount(
                studentFee?.netAmount ?? feeStructure?.amount,
              )}
            />
            <Row
              label="Paid Amount"
              value={formatAmount(studentFee?.paidAmount)}
              valueClass="font-semibold text-emerald-600"
            />
            <div className="pt-2 border-t border-dashed border-slate-200">
              <Row
                label="Remaining Due"
                value={formatAmount(studentFee?.dueAmount)}
                valueClass="text-sm font-bold text-slate-900"
              />
            </div>
          </div>
        </Section>

        {/* Gateway Audit Logs */}
        <Section title="Gateway Audit Logs" icon={Wallet}>
          <div className="space-y-3 text-xs">
            <Row
              label="Gateway Reference ID"
              value={payment.gatewayTransactionId}
              icon={Hash}
              mono
            />
            <Row
              label="System Created At"
              value={formatDate(payment.createdAt, true)}
              icon={CalendarDays}
            />
          </div>
        </Section>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-slate-50 shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Payment Details
              </h2>
              <p className="text-xs text-slate-500">
                Transaction summary & history
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            aria-label="Close panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {renderContent()}
        </div>

        {/* Drawer Footer Actions */}
        <div className="border-t border-slate-200/80 bg-white p-4 space-y-2">
          {payment?.paymentStatus === "SUCCESS" && (
            <button
              type="button"
              onClick={() => setIsReverseDialogOpen(true)}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              <RotateCcw className="h-4 w-4" />
              Reverse Payment
            </button>
          )}
          {payment?.paymentStatus === "SUCCESS" && (
            <button
              type="button"
              disabled={isDownloading || isReceiptLoading}
              className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={downloadReceiptFile}
            >
              <Download className="h-4 w-4" />
              {isDownloading ? "Downloading..." : "Download Receipt"}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-full items-center justify-center rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-600 hover:bg-slate-50 transition"
          >
            Close
          </button>
        </div>
      </aside>

      {isReverseDialogOpen && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/50 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reverse-payment-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h3 id="reverse-payment-title" className="text-base font-bold text-slate-900">
                  Reverse payment?
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  This will reverse {formatAmount(payment?.amount)} and restore
                  the amount to the student&apos;s outstanding fee.
                </p>
              </div>
            </div>

            <label htmlFor="reverse-reason" className="mt-5 block text-sm font-medium text-slate-700">
              Reversal reason <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="reverse-reason"
              value={reverseReason}
              onChange={(event) => {
                setReverseReason(event.target.value);
                if (reverseError) setReverseError("");
              }}
              maxLength={300}
              rows={4}
              autoFocus
              disabled={isReversing}
              placeholder="Explain why this payment is being reversed..."
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 disabled:bg-slate-50"
            />
            <div className="mt-1 flex justify-between text-xs text-slate-400">
              <span>Minimum 5 characters</span>
              <span>{reverseReason.length}/300</span>
            </div>
            {reverseError && (
              <p className="mt-3 text-sm text-rose-600" role="alert">
                {reverseError}
              </p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={closeReverseDialog}
                disabled={isReversing}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReversePayment}
                disabled={isReversing || reverseReason.trim().length < 5}
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RotateCcw className="h-4 w-4" />
                {isReversing ? "Reversing..." : "Reverse Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DetailItem = ({ label, value, mono = false, icon: Icon }) => (
  <div className="space-y-1">
    <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </p>
    <p
      className={`text-xs font-semibold text-slate-800 truncate ${
        mono ? "font-mono tracking-tight text-slate-700" : ""
      }`}
    >
      {value ?? "N/A"}
    </p>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <section className="space-y-2">
    <div className="flex items-center gap-2 px-0.5">
      <Icon className="h-3.5 w-3.5 text-blue-600" />
      <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
        {title}
      </h3>
    </div>
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
      {children}
    </div>
  </section>
);

const Row = ({
  label,
  value,
  valueClass = "font-semibold text-slate-800",
  className = "flex items-center justify-between gap-2",
  icon: Icon,
  mono = false,
}) => (
  <div className={className}>
    <span className="flex items-center gap-1.5 text-slate-500 truncate">
      {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" />}
      {label}
    </span>
    <span className={`${valueClass} ${mono ? "font-mono tracking-tight" : ""}`}>
      {value ?? "N/A"}
    </span>
  </div>
);

export default PaymentDetailsDrawer;
