import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/auth.context";
import { useStudentMe } from "../../features/students/student.hooks";
import { useMyStudentFeeSummary } from "../../features/studentFee/studentFee.hooks";
import {
  useMyPayments,
  useDownloadPaymentReceipt,
} from "../../features/payments/payment.hooks";
import { formatCurrency } from "../../utils/formatCurrency";
import {
  GraduationCap,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Receipt,
  CreditCard,
  Download,
  Loader2,
  Calendar,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

function StudentDashboard() {
  const { user } = useAuth();
  const { data: student, isLoading: isStudentLoading } = useStudentMe();
  const { data: summary, isLoading: isSummaryLoading } =
    useMyStudentFeeSummary();
  const { data: payments = [], isLoading: isPaymentsLoading } = useMyPayments();
  const { mutate: downloadReceipt } = useDownloadPaymentReceipt();
  const [downloadingPaymentId, setDownloadingPaymentId] = useState(null);

  const isLoading = isStudentLoading || isSummaryLoading || isPaymentsLoading;

  const handleDownloadReceipt = (paymentId, receiptNumber) => {
    setDownloadingPaymentId(paymentId);
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
        setDownloadingPaymentId(null);
      },
      onError: () => {
        setDownloadingPaymentId(null);
      },
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
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

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading student dashboard...
          </p>
        </div>
      </div>
    );
  }

  const totalFee = summary?.totalNetAmount ?? 0;
  const totalPaid = summary?.totalPaidAmount ?? 0;
  const totalDue = summary?.totalDueAmount ?? 0;
  const isAllPaid = totalFee > 0 && totalDue === 0;

  const studentName = student?.name || user?.name || "Student";
  const className = student?.classId?.name || "N/A";
  const sectionName = student?.sectionId?.name || "N/A";
  const rollNumber = student?.rollNumber || "N/A";
  const admissionNumber = student?.admissionNumber || "N/A";

  const displayedPayments = Array.isArray(payments) ? payments.slice(0, 5) : [];

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-8">
      {/* Hero / Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm mb-3">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Student Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-poppins tracking-tight">
              Welcome back, {studentName}!
            </h1>
            <p className="mt-1 text-sm text-blue-100 max-w-xl">
              Here is an overview of your fee balances, recent transactions, and
              payment receipts.
            </p>

            {/* Academic Badges */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                <GraduationCap className="h-3.5 w-3.5 text-blue-200" />
                Class: {className}{" "}
                {sectionName !== "N/A" ? `(${sectionName})` : ""}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                Roll No: {rollNumber}
              </span>
              {admissionNumber !== "N/A" && (
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                  Adm: {admissionNumber}
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <Link
              to="/my-fees"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-md transition-all duration-200 hover:bg-blue-50 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <Wallet className="h-4 w-4" />
              <span>View My Fees</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Decorative background blob */}
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* Financial Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Fee Card */}
        <div className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-poppins">
              Total Fee
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-200/60 transition-transform duration-200 group-hover:scale-105">
              <Wallet className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3">
            <p className="font-poppins text-xl font-bold tracking-tight text-slate-900 lg:text-2xl">
              {formatCurrency(totalFee)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Total payable fee ledger
            </p>
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-blue-500 transition-all duration-300 group-hover:w-full" />
        </div>

        {/* Paid Amount Card */}
        <div className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-poppins">
              Paid Amount
            </span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/60 transition-transform duration-200 group-hover:scale-105">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3">
            <p className="font-poppins text-xl font-bold tracking-tight text-emerald-600 lg:text-2xl">
              {formatCurrency(totalPaid)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Total fees paid so far
            </p>
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-emerald-500 transition-all duration-300 group-hover:w-full" />
        </div>

        {/* Due Amount Card */}
        <div className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-poppins">
              Due Amount
            </span>
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 transition-transform duration-200 group-hover:scale-105 ${
                totalDue > 0
                  ? "bg-rose-50 text-rose-600 ring-rose-200/60"
                  : "bg-slate-50 text-slate-500 ring-slate-200"
              }`}
            >
              <AlertCircle className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3">
            <p
              className={`font-poppins text-xl font-bold tracking-tight lg:text-2xl ${
                totalDue > 0 ? "text-rose-600" : "text-slate-900"
              }`}
            >
              {formatCurrency(totalDue)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {totalDue > 0 ? "Pending payment balance" : "All fees cleared"}
            </p>
          </div>
          <div
            className={`absolute bottom-0 left-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full ${
              totalDue > 0 ? "bg-rose-500" : "bg-slate-400"
            }`}
          />
        </div>

        {/* Fee Status Card */}
        <div className="group relative overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-poppins">
              Fee Status
            </span>
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ring-1 transition-transform duration-200 group-hover:scale-105 ${
                isAllPaid
                  ? "bg-emerald-50 text-emerald-600 ring-emerald-200"
                  : totalPaid > 0
                    ? "bg-amber-50 text-amber-600 ring-amber-200"
                    : "bg-slate-50 text-slate-600 ring-slate-200"
              }`}
            >
              <Clock className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3">
            <p className="font-poppins text-xl font-bold tracking-tight text-slate-900 lg:text-2xl">
              {isAllPaid ? (
                <span className="text-emerald-600">PAID</span>
              ) : totalPaid > 0 ? (
                <span className="text-amber-600">PARTIAL</span>
              ) : totalFee > 0 ? (
                <span className="text-rose-600">UNPAID</span>
              ) : (
                <span className="text-slate-500">NO DUES</span>
              )}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {isAllPaid
                ? "Full clearance"
                : `${summary?.totalInvoices || 0} fee record(s)`}
            </p>
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-500 transition-all duration-300 group-hover:w-full" />
        </div>
      </div>

      {/* Due Alert Banner if dues exist */}
      {totalDue > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-amber-900 text-sm">
                Outstanding Balance: {formatCurrency(totalDue)}
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                You have pending dues. You can pay online conveniently using
                eSewa.
              </p>
            </div>
          </div>
          <Link
            to="/my-fees"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
          >
            <CreditCard className="h-4 w-4" />
            <span>Pay with eSewa</span>
          </Link>
        </div>
      )}

      {/* Recent Payments Section */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold font-poppins text-slate-900">
              My Recent Payments
            </h2>
            <p className="text-xs text-slate-500">
              Transactions processed for your account
            </p>
          </div>
          <Link
            to="/my-fees"
            className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            <span>All Fees & History</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {displayedPayments.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-10 text-center bg-slate-50/50">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
              <CreditCard className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              No payments recorded yet
            </p>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              When payments are completed offline or online via eSewa, receipts
              will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="pb-3 pr-4">Transaction / Fee</th>
                  <th className="pb-3 pr-4">Method</th>
                  <th className="pb-3 pr-4">Amount</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-roboto text-sm">
                {displayedPayments.map((payment) => {
                  const feeTitle =
                    payment.studentFeeId?.feeStructureId?.name ||
                    payment.studentFeeId?.feeStructureId?.feeType ||
                    "Student Fee";

                  const isDownloadingThis =
                    downloadingPaymentId === payment._id;

                  return (
                    <tr
                      key={payment._id}
                      className="transition-colors hover:bg-slate-50/60"
                    >
                      <td className="py-3.5 pr-4">
                        <div>
                          <p className="font-medium text-slate-900 text-xs sm:text-sm">
                            {feeTitle}
                          </p>
                          <p className="text-[11px] text-slate-400 font-mono">
                            {payment.transactionId ||
                              `TXN-${payment._id.slice(-6)}`}
                          </p>
                        </div>
                      </td>

                      <td className="py-3.5 pr-4 text-xs font-medium text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <CreditCard className="h-3.5 w-3.5 text-slate-400" />
                          <span>{formatMethod(payment.paymentMethod)}</span>
                        </div>
                      </td>

                      <td className="py-3.5 pr-4 font-semibold font-poppins text-slate-900">
                        {formatCurrency(payment.amount)}
                      </td>

                      <td className="py-3.5 pr-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
                            payment.paymentStatus === "SUCCESS"
                              ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                              : payment.paymentStatus === "PENDING"
                                ? "bg-amber-50 text-amber-700 ring-amber-600/20"
                                : "bg-rose-50 text-rose-700 ring-rose-600/20"
                          }`}
                        >
                          {payment.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3.5 pr-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {formatDate(payment.paidAt || payment.createdAt)}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 text-right">
                        {payment.paymentStatus === "SUCCESS" ? (
                          <button
                            type="button"
                            onClick={() => handleDownloadReceipt(payment._id)}
                            disabled={isDownloadingThis}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors shadow-2xs disabled:opacity-50"
                          >
                            {isDownloadingThis ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
                            ) : (
                              <Download className="h-3.5 w-3.5 text-slate-500" />
                            )}
                            <span>Receipt</span>
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default StudentDashboard;
