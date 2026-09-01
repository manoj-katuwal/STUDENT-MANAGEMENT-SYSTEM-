import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  ArrowUpRight,
  CreditCard,
  Calendar,
  User,
  Receipt,
} from "lucide-react";

function RecentPayments({ payments = [] }) {
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format Method Names nicely
  const formatMethod = (method) => {
    if (!method) return "-";
    if (method === "BANK_TRANSFER") return "Bank Transfer";
    if (method === "ESEWA") return "eSewa";
    if (method === "KHALTI") return "Khalti";
    if (method === "CASH") return "Cash";
    if (method === "CHEQUE") return "Cheque";
    return method;
  };

  // Status badge variants
  const statusStyles = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
    failed: "bg-rose-50 text-rose-700 ring-rose-600/20",
    default: "bg-slate-50 text-slate-700 ring-slate-600/20",
  };

  const getStatusStyle = (status) => {
    const key = status?.toLowerCase();
    return statusStyles[key] || statusStyles.default;
  };

  // Limit to 5 latest items on dashboard to prevent layout stretch
  const displayedPayments = payments.slice(0, 5);

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs h-full">
      <div>
        {/* Header with "View All" */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold font-poppins text-slate-900">
              Recent Payments
            </h2>
            <p className="text-xs text-slate-500">
              Latest successful transactions
            </p>
          </div>
          {payments.length > 0 && (
            <Link
              to="/payments"
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              View All
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>

      {/* Table / Empty State */}
      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-10 text-center bg-slate-50/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
            <CreditCard className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-slate-700">
            No recent payments found
          </p>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            As soon as student fee payments are processed, recent transaction
            details will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="pb-3 pr-4">Student</th>
                <th className="pb-3 pr-4">Method</th>
                <th className="pb-3 pr-4">Amount</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-roboto">
              {displayedPayments.map((payment) => {
                const studentObj =
                  typeof payment.studentFeeId?.studentId === "object"
                    ? payment.studentFeeId?.studentId
                    : null;

                const studentName =
                  studentObj?.name ||
                  (typeof payment.studentFeeId?.studentId === "string"
                    ? `ID: ${payment.studentFeeId.studentId.slice(-6)}`
                    : "Student");

                const admissionNo =
                  studentObj?.admissionNumber || studentObj?.rollNumber;

                return (
                  <tr
                    key={payment._id}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    {/* Student */}
                    <td className="py-3 pr-4 text-sm text-slate-800">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600 font-medium text-xs font-poppins">
                          {studentName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 text-xs sm:text-sm">
                            {studentName}
                          </p>
                          {admissionNo && (
                            <p className="text-[11px] text-slate-400">
                              Adm: {admissionNo}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Method */}
                    <td className="py-3 pr-4 text-xs font-medium text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <CreditCard
                          className="h-3.5 w-3.5 text-slate-400"
                          aria-hidden="true"
                        />
                        <span>{formatMethod(payment.paymentMethod)}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 pr-4 text-sm font-semibold font-poppins text-slate-900">
                      {formatCurrency(payment.amount)}
                    </td>

                    {/* Status */}
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${getStatusStyle(
                          payment.paymentStatus,
                        )}`}
                      >
                        {payment.paymentStatus || "N/A"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 text-right text-xs text-slate-500">
                      <span>{formatDate(payment.paidAt)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {payments.length > 5 && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing 5 of {payments.length} recent payments</span>
          <Link
            to="/payments"
            className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
          >
            View all payments →
          </Link>
        </div>
      )}
    </div>
  );
}

export default RecentPayments;
