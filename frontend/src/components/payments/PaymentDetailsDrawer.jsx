import {
  X,
  User,
  Receipt,
  CalendarDays,
  Hash,
  Wallet,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import { usePayment } from "../../features/payments/payment.hooks";

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

const PaymentDetailsDrawer = ({ onClose, paymentId }) => {
  const { data: payment, isLoading, isError } = usePayment(paymentId);
  const studentFee = payment?.studentFeeId;
  const student = studentFee?.studentId;
  const feeStructure = studentFee?.feeStructureId;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-500">
          Loading payment details...
        </div>
      );
    }

    if (isError || !payment) {
      return (
        <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-rose-600">
          Unable to load payment details. Please try again.
        </div>
      );
    }

    const status = payment.paymentStatus ?? "N/A";

    return (
      <div className="space-y-6">
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          <div className="border-b border-slate-100 bg-slate-50/50 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Total Paid
                </span>
                <div className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">
                  {formatAmount(payment.amount)}
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                {status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4 p-5 text-xs">
            <DetailItem label="Payment Method" value={payment.paymentMethod} />
            <DetailItem label="Payment Type" value={payment.paymentType} />
            <DetailItem
              label="Payment Date"
              value={formatDate(payment.paidAt ?? payment.createdAt)}
            />
            <DetailItem
              label="Transaction ID"
              value={payment.transactionId}
              mono
            />
          </div>
        </section>

        <Section title="Student Profile" icon={User}>
          <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
              {student?.name?.slice(0, 2).toUpperCase() ?? "N/A"}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900">
                {student?.name ?? "N/A"}
              </h4>
              <p className="mt-0.5 text-xs font-mono text-slate-500">
                Admission ID:{" "}
                <span className="font-medium text-slate-700">
                  {student?.admissionNumber ?? "N/A"}
                </span>
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <DetailItem
              label="Academic Year"
              value={studentFee?.academicYearId?.name}
            />
            <DetailItem label="Class" value={student?.classId?.name} />
          </div>
        </Section>

        <Section title="Fee Details" icon={GraduationCap}>
          <div className="space-y-3 text-sm">
            <Row label="Fee Type" value={feeStructure?.feeType} />
            <Row
              label="Total Fee"
              value={formatAmount(studentFee?.netAmount ?? feeStructure?.amount)}
            />
            <Row
              label="Paid Amount"
              value={formatAmount(studentFee?.paidAmount)}
              valueClass="font-semibold text-emerald-600"
            />
            <Row
              label="Remaining Due"
              value={formatAmount(studentFee?.dueAmount)}
              valueClass="text-base font-bold text-slate-900"
              className="border-t border-dashed border-slate-200 pt-3"
            />
          </div>
        </Section>

        <Section title="Gateway Audit Logs" icon={Wallet}>
          <Row
            label="Gateway Transaction ID"
            value={payment.gatewayTransactionId}
            icon={Hash}
            mono
          />
          <Row
            label="Created At"
            value={formatDate(payment.createdAt, true)}
            icon={CalendarDays}
          />
        </Section>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-lg flex-col bg-slate-50 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200/80 bg-white px-6 py-4.5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                Payment Details
              </h2>
              <p className="text-xs text-slate-500">
                Transaction & fee breakdown
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close payment details"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {renderContent()}
        </div>

        <div className="flex justify-end border-t border-slate-200/80 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </aside>
    </div>
  );
};

const DetailItem = ({ label, value, mono = false }) => (
  <div>
    <p className="font-medium text-slate-400">{label}</p>
    <p
      className={`mt-1 text-sm font-semibold text-slate-800 ${
        mono ? "font-mono text-xs tracking-tight" : ""
      }`}
    >
      {value ?? "N/A"}
    </p>
  </div>
);

const Section = ({ title, icon: Icon, children }) => (
  <section>
    <div className="mb-2.5 flex items-center gap-2 px-1">
      <Icon className="h-4 w-4 text-blue-600" />
      <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </h3>
    </div>
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      {children}
    </div>
  </section>
);

const Row = ({
  label,
  value,
  valueClass = "font-medium text-slate-800",
  className = "flex items-center justify-between",
  icon: Icon,
  mono = false,
}) => (
  <div className={className}>
    <span className="flex items-center gap-2 text-slate-500">
      {Icon && <Icon className="h-4 w-4 text-slate-500" />}
      {label}
    </span>
    <span className={`${valueClass} ${mono ? "font-mono text-xs" : ""}`}>
      {value ?? "N/A"}
    </span>
  </div>
);

export default PaymentDetailsDrawer;
