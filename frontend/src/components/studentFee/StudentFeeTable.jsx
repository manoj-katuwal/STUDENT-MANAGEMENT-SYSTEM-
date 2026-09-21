import React from "react";
import { Eye, Pencil, AlertCircle, RefreshCw, Layers, Ban } from "lucide-react";
import { useAuth } from "../../features/auth/auth.context";

const StudentFeeTable = ({
  studentFees = [],
  isLoading = false,
  isError = false,
  onRetry,
  onView,
  onEdit,
  onCancel,
}) => {
  const { user } = useAuth();
  const canManageFees = user?.role === "ADMIN" || user?.role === "ACCOUNTANT";

  const getStatusBadge = (status) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            Paid
          </span>
        );
      case "PARTIAL":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
            Partial
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
            Pending
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-500/10">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="animate-pulse">
          <div className="h-12 border-b border-slate-200/80 bg-slate-50/50" />
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="grid grid-cols-5 items-center gap-4 border-b border-slate-100 px-6 py-4"
            >
              <div className="h-4.5 w-3/4 rounded bg-slate-200/70" />
              <div className="h-5 w-16 rounded-md bg-slate-200/70" />
              <div className="h-6 w-20 rounded-full bg-slate-200/70" />
              <div className="h-4.5 w-24 rounded bg-slate-200/70" />
              <div className="ml-auto flex gap-2">
                <div className="h-8 w-8 rounded-lg bg-slate-100" />
                <div className="h-8 w-8 rounded-lg bg-slate-100" />
                <div className="h-8 w-8 rounded-lg bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-base font-semibold text-slate-900">
          Failed to load fee records
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Something went wrong while fetching the records. Please try again.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-red-700 shadow-xs ring-1 ring-inset ring-red-200 transition-all hover:bg-red-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  // 3. Empty State
  if (studentFees.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-14 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Layers className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-900">
          No fee records found
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Try adjusting your search or filters to find what you are looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-slate-600">
          {/* Table Header */}
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                Student
              </th>
              <th scope="col" className="px-4 py-3.5">
                Admission No.
              </th>
              <th scope="col" className="px-4 py-3.5">
                Academic Year
              </th>
              <th scope="col" className="px-4 py-3.5">
                Fee Type
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Total
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Discount
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Net
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Paid
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Due
              </th>
              <th scope="col" className="px-4 py-3.5 text-center">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 bg-white">
            {studentFees.map((row) => (
              <tr
                key={row._id}
                className="transition-colors hover:bg-slate-50/60"
              >
                {/* Student Info */}
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-100/60 bg-indigo-50 font-semibold text-indigo-600">
                      {row.studentId?.name
                        ? row.studentId.name.charAt(0).toUpperCase()
                        : "S"}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 block">
                        {row.studentId?.name || "Unknown Student"}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Admission No */}
                <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-700 font-mono text-xs">
                  {row.studentId?.admissionNumber || "-"}
                </td>

                {/* Academic Year */}
                <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                  {row.academicYearId?.name || "—"}
                </td>

                {/* Fee Type */}
                <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-800">
                  {row.feeStructureId?.feeType || "—"}
                </td>

                {/* Total */}
                <td className="px-4 py-4 text-right whitespace-nowrap font-medium text-slate-600">
                  NPR {(row.totalAmount ?? 0).toLocaleString()}
                </td>

                {/* Discount */}
                <td className="px-4 py-4 text-right whitespace-nowrap text-slate-500">
                  {(row.discountAmount ?? 0) > 0
                    ? `NPR ${(row.discountAmount ?? 0).toLocaleString()}`
                    : "-"}
                </td>

                {/* Net */}
                <td className="px-4 py-4 text-right whitespace-nowrap font-semibold text-slate-900">
                  NPR {(row.netAmount ?? 0).toLocaleString()}
                </td>

                {/* Paid */}
                <td className="px-4 py-4 text-right whitespace-nowrap font-semibold text-emerald-600">
                  NPR {(row.paidAmount ?? 0).toLocaleString()}
                </td>

                {/* Due */}
                <td className="px-4 py-4 text-right whitespace-nowrap font-semibold text-rose-600">
                  {(row.dueAmount ?? 0) > 0
                    ? `NPR ${(row.dueAmount ?? 0).toLocaleString()}`
                    : "NPR 0"}
                </td>

                {/* Status */}
                <td className="px-4 py-4 text-center whitespace-nowrap">
                  {getStatusBadge(row.status)}
                </td>

                {/* Actions */}
                <td className="px-5 py-4 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title="View Fee Breakdown"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                      onClick={() => onView?.(row)}
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {canManageFees && row.status !== "CANCELLED" && (
                      <button
                        type="button"
                        title="Adjust Concession / Discount"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        onClick={() => onEdit?.(row)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}

                    {canManageFees && row.status !== "CANCELLED" && (
                      <button
                        type="button"
                        title={
                          (row.paidAmount ?? 0) > 0
                            ? `Cannot cancel: Payment of NPR ${(row.paidAmount ?? 0).toLocaleString()} exists`
                            : "Cancel Fee Assignment"
                        }
                        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                          (row.paidAmount ?? 0) > 0
                            ? "text-slate-300 hover:text-amber-600 hover:bg-amber-50"
                            : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        }`}
                        onClick={() => onCancel?.(row)}
                      >
                        <Ban className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentFeeTable;
