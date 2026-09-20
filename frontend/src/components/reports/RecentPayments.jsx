import { Link } from "react-router-dom";
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  CreditCard,
  Receipt,
  RefreshCw,
  User,
} from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

const getInitials = (name = "") => {
  if (!name || name === "N/A") return null;
  const parts = name.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0].charAt(0).toUpperCase()
    : `${parts[0][0]}${parts.at(-1)[0]}`.toUpperCase();
};

const formatPaymentMethod = (method) => {
  if (!method) return "Cash";
  return method
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const RecentPayments = ({
  data = [],
  isLoading = false,
  isError = false,
  onRetry,
  isRetrying = false,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-5 w-40 animate-pulse rounded-md bg-slate-200" />
            <div className="h-3.5 w-60 animate-pulse rounded-md bg-slate-100" />
          </div>
          <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-100" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="h-14 animate-pulse rounded-xl bg-slate-50"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <section className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
        <div className="flex min-h-48 flex-col items-center justify-center text-center">
          <div className="rounded-full bg-rose-50 p-3 text-rose-500">
            <AlertCircle className="h-6 w-6" />
          </div>
          <p className="mt-3 text-sm font-semibold text-slate-800">
            Unable to load recent payments
          </p>
          <button
            type="button"
            onClick={onRetry}
            disabled={isRetrying}
            className="mt-3 inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${isRetrying ? "animate-spin" : ""}`}
            />
            Try again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-6 pb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Recent Payments
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Latest successful payment transactions
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/10">
          <Receipt className="h-5 w-5 stroke-[2.2]" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-175 border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-3">Student</th>
              <th className="px-4 py-3">Admission No.</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Method</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-6 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length > 0 ? (
              data.map((payment) => {
                const student = payment.studentFeeId?.studentId;
                const studentName = student?.name ?? "N/A";
                const admissionNo =
                  student?.admissionNumber ?? student?.rollNumber ?? "—";
                const paidDate = payment.paidAt
                  ? new Date(payment.paidAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })
                  : "—";
                return (
                  <tr
                    key={payment._id}
                    className="group transition-colors duration-150 hover:bg-slate-50/80"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold tracking-wider text-indigo-600 ring-1 ring-indigo-500/10">
                          {getInitials(studentName) ?? (
                            <User className="h-4 w-4 text-indigo-500" />
                          )}
                        </div>
                        <span className="truncate text-sm font-semibold text-slate-800 transition-colors group-hover:text-indigo-600">
                          {studentName}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-md border border-slate-200/50 bg-slate-100/80 px-2 py-1 font-mono text-xs font-medium text-slate-600">
                        {admissionNo}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-sm font-bold text-slate-900">
                      {formatCurrency(payment.amount ?? 0)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                        {formatPaymentMethod(payment.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {paidDate}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        {payment.paymentStatus ?? "Success"}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-slate-100 p-3.5 text-slate-400">
                      <Receipt className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-xs font-semibold text-slate-700">
                      No payment transactions found
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      Completed fee payments will appear here.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {data.length > 0 && (
        <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5">
          <p className="text-xs text-slate-500">
            Showing {data.length} latest{" "}
            {data.length === 1 ? "payment" : "payments"}
          </p>
          <Link
            to="/payments"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
          >
            View all payments <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}
    </section>
  );
};

export default RecentPayments;
