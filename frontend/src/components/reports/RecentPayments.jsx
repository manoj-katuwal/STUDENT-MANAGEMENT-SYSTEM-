import React from "react";
import {
  Receipt,
  CreditCard,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  User,
  Calendar,
  ArrowUpRight,
} from "lucide-react";

// Helper to extract up to 2 initials from a full name (e.g., "John Doe" -> "JD")
const getInitials = (name = "") => {
  if (!name || name === "N/A") return null;
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Helper for Status Badge Styling
const getStatusBadge = (status = "") => {
  const normalized = status.toLowerCase();
  switch (normalized) {
    case "success":
    case "completed":
    case "paid":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
          <span className="capitalize">{status}</span>
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
          <Clock className="h-3.5 w-3.5 text-amber-600" />
          <span className="capitalize">{status}</span>
        </span>
      );
    case "failed":
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
          <XCircle className="h-3.5 w-3.5 text-rose-600" />
          <span className="capitalize">{status}</span>
        </span>
      );
    case "reversed":
    case "refunded":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-300/60">
          <RotateCcw className="h-3.5 w-3.5 text-rose-500" />
          <span className="capitalize">{status}</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {status || "N/A"}
        </span>
      );
  }
};

const RecentPayments = ({ data = [], isLoading = false}) => {
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
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-14 w-full animate-pulse rounded-xl bg-slate-50"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 p-6 pb-5">
        <div>
          <h2 className="text-base font-bold text-slate-900">
            Recent Payments
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Latest payment transactions across all departments
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/10">
          <Receipt className="h-5 w-5 stroke-[2.2]" />
        </div>
      </div>

      {/* Table Area */}
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
                const studentName =
                  payment.studentFeeId?.studentId?.name ?? "N/A";
                const admissionNo =
                  payment.studentFeeId?.studentId?.admissionNumber ?? "—";
                const initials = getInitials(studentName);

                return (
                  <tr
                    key={payment._id}
                    className="group transition-colors duration-150 hover:bg-slate-50/80"
                  >
                    {/* Student Name & Avatar */}
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-50 font-bold text-indigo-600 text-xs tracking-wider ring-1 ring-indigo-500/10">
                          {initials ? (
                            initials
                          ) : (
                            <User className="h-4 w-4 text-indigo-500" />
                          )}
                        </div>
                        <span className="truncate text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {studentName}
                        </span>
                      </div>
                    </td>

                    {/* Admission Number */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center rounded-md bg-slate-100/80 px-2 py-1 text-xs font-mono font-medium text-slate-600 border border-slate-200/50">
                        {admissionNo}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="px-4 py-3.5 text-sm font-bold text-slate-900">
                      Rs. {Number(payment.amount ?? 0).toLocaleString("en-IN")}
                    </td>

                    {/* Payment Method */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 capitalize">
                        <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                        {payment.paymentMethod ?? "Cash"}
                      </span>
                    </td>

                    {/* Payment Date with Icon */}
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-3.5 text-right">
                      {getStatusBadge(payment.paymentStatus)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-slate-100 p-3.5 text-slate-400">
                      <Receipt className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-xs font-semibold text-slate-700">
                      No payment transactions found
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">
                      When students complete fee payments, they will appear here
                      in real-time.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

     
    </div>
  );
};

export default RecentPayments;
