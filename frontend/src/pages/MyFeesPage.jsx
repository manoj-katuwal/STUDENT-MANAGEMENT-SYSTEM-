import React, { useState } from "react";
import {
  Wallet,
  CheckCircle2,
  AlertCircle,
  Clock,
  CreditCard,
  History,
  Calendar,
  Search,
  Filter,
  Loader2,
  FileText,
  Percent,
} from "lucide-react";
import {
  useMyStudentFees,
  useMyStudentFeeSummary,
} from "../features/studentFee/studentFee.hooks";
import { formatCurrency } from "../utils/formatCurrency";
import EsewaPayModal from "../components/studentFee/EsewaPayModal";
import FeePaymentHistoryModal from "../components/studentFee/FeePaymentHistoryModal";

function MyFeesPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFeeForPay, setSelectedFeeForPay] = useState(null);
  const [selectedFeeForHistory, setSelectedFeeForHistory] = useState(null);

  const { data: feesData = [], isLoading: isFeesLoading } = useMyStudentFees();
  const { data: summary, isLoading: isSummaryLoading } =
    useMyStudentFeeSummary();

  const isLoading = isFeesLoading || isSummaryLoading;

  const totalFee = summary?.totalNetAmount ?? 0;
  const totalPaid = summary?.totalPaidAmount ?? 0;
  const totalDue = summary?.totalDueAmount ?? 0;

  // Filter fees
  const feesList = Array.isArray(feesData)
    ? feesData
    : feesData?.studentFees || [];

  const filteredFees = feesList.filter((fee) => {
    // Status filter
    if (statusFilter === "PAID" && fee.status !== "PAID") return false;
    if (
      statusFilter === "DUE" &&
      fee.status !== "UNPAID" &&
      fee.status !== "PARTIAL"
    )
      return false;
    if (statusFilter === "PARTIAL" && fee.status !== "PARTIAL") return false;
    if (statusFilter === "UNPAID" && fee.status !== "UNPAID") return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = fee.feeStructureId?.name?.toLowerCase() || "";
      const feeType = fee.feeStructureId?.feeType?.toLowerCase() || "";
      const year =
        fee.academicYearId?.name?.toLowerCase() ||
        fee.academicYearId?.year?.toString() ||
        "";
      if (!name.includes(q) && !feeType.includes(q) && !year.includes(q)) {
        return false;
      }
    }

    return true;
  });

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
            <CheckCircle2 className="h-3 w-3" />
            Paid
          </span>
        );
      case "PARTIAL":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/20">
            <Clock className="h-3 w-3" />
            Partial
          </span>
        );
      case "UNPAID":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-rose-600/20">
            <AlertCircle className="h-3 w-3" />
            Unpaid
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-300">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading your fee ledgers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-poppins text-slate-900">
          My Fees & Statements
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          View your assigned fee structures, payment status, and make online
          payments.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {/* Total Fee Card */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-poppins">
              Total Fee Assigned
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600 ring-1 ring-blue-200/60">
              <Wallet className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3">
            <p className="font-poppins text-2xl font-bold text-slate-900">
              {formatCurrency(totalFee)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {feesList.length} total fee record(s)
            </p>
          </div>
        </div>

        {/* Paid Amount Card */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-poppins">
              Total Paid
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/60">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </span>
          </div>
          <div className="mt-3">
            <p className="font-poppins text-2xl font-bold text-emerald-600">
              {formatCurrency(totalPaid)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Successfully settled amount
            </p>
          </div>
        </div>

        {/* Due Amount Card */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 font-poppins">
              Total Remaining Due
            </span>
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 ${
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
              className={`font-poppins text-2xl font-bold ${
                totalDue > 0 ? "text-rose-600" : "text-slate-900"
              }`}
            >
              {formatCurrency(totalDue)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {totalDue > 0 ? "Outstanding balance to pay" : "No pending dues"}
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by fee title, academic year..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-200 py-2 pl-9.5 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "ALL", label: "All" },
            { id: "DUE", label: "Pending / Due" },
            { id: "PAID", label: "Paid" },
            { id: "PARTIAL", label: "Partial" },
            { id: "UNPAID", label: "Unpaid" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === tab.id
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Fee Records List */}
      {filteredFees.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center shadow-xs">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-500 mb-3">
            <FileText className="h-6 w-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-800 font-poppins">
            No fee records found
          </h3>
          <p className="mt-1 text-xs text-slate-400 max-w-sm">
            {searchQuery || statusFilter !== "ALL"
              ? "No fee entries matched your search or status filter criteria."
              : "No fee structures have been assigned to your account yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredFees.map((fee) => {
            const feeTitle =
              fee.feeStructureId?.name ||
              fee.feeStructureId?.feeType ||
              "Student Fee";
            const academicYear =
              fee.academicYearId?.name ||
              (fee.academicYearId?.year
                ? `Year ${fee.academicYearId.year}`
                : "-");
            const hasDue =
              (fee.dueAmount || 0) > 0 && fee.status !== "CANCELLED";
            const discountAmount =
              fee.discountAmount ||
              (fee.grossAmount && fee.netAmount
                ? fee.grossAmount - fee.netAmount
                : 0);

            return (
              <div
                key={fee._id}
                className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs transition-all hover:shadow-md"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Left Column: Fee Details */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-base sm:text-lg font-semibold font-poppins text-slate-900">
                        {feeTitle}
                      </h3>
                      {getStatusBadge(fee.status)}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          Academic Year:{" "}
                          <strong className="text-slate-700">
                            {academicYear}
                          </strong>
                        </span>
                      </div>
                      {fee.dueDate && (
                        <div className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            Due Date:{" "}
                            <strong className="text-slate-700">
                              {formatDate(fee.dueDate)}
                            </strong>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Breakdown Pill Badges */}
                    <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-slate-600 font-medium">
                        Gross:{" "}
                        {formatCurrency(
                          fee.grossAmount || fee.amount || fee.netAmount,
                        )}
                      </span>
                      {discountAmount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-emerald-700 font-medium">
                          <Percent className="h-3 w-3" />
                          Discount: -{formatCurrency(discountAmount)}
                        </span>
                      )}
                      <span className="rounded-md bg-blue-50 px-2.5 py-1 text-blue-700 font-medium">
                        Net Payable:{" "}
                        {formatCurrency(fee.netAmount ?? fee.finalAmount)}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Financial Figures & Actions */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between lg:justify-end gap-5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <div className="grid grid-cols-2 sm:flex sm:items-center gap-4 sm:gap-6 text-left sm:text-right">
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                          Paid
                        </p>
                        <p className="text-sm sm:text-base font-bold text-emerald-600 font-poppins">
                          {formatCurrency(fee.paidAmount || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                          Due
                        </p>
                        <p
                          className={`text-sm sm:text-base font-bold font-poppins ${
                            hasDue ? "text-rose-600" : "text-slate-800"
                          }`}
                        >
                          {formatCurrency(fee.dueAmount || 0)}
                        </p>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedFeeForHistory(fee)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                      >
                        <History className="h-3.5 w-3.5 text-slate-500" />
                        <span>History</span>
                      </button>

                      {hasDue && (
                        <button
                          type="button"
                          onClick={() => setSelectedFeeForPay(fee)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-colors"
                        >
                          <CreditCard className="h-3.5 w-3.5" />
                          <span>Pay with eSewa</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* eSewa Pay Modal */}
      {selectedFeeForPay && (
        <EsewaPayModal
          open={Boolean(selectedFeeForPay)}
          onClose={() => setSelectedFeeForPay(null)}
          studentFee={selectedFeeForPay}
        />
      )}

      {/* Fee Payment History Modal */}
      {selectedFeeForHistory && (
        <FeePaymentHistoryModal
          open={Boolean(selectedFeeForHistory)}
          onClose={() => setSelectedFeeForHistory(null)}
          studentFee={selectedFeeForHistory}
        />
      )}
    </div>
  );
}

export default MyFeesPage;
