import React from "react";
import {
  AlertCircle,
  Calendar,
  Eye,
  Layers,
  Pencil,
  Power,
  RefreshCw,
  Banknote,
} from "lucide-react";

const FeeStructureTable = ({
  feeStructures = [],
  isLoading = false,
  isError = false,
  onRetry,
  onView,
  onEdit,
  onToggleStatus,
}) => {
  // 1. Loading Skeleton State
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="animate-pulse">
          <div className="h-12 border-b border-slate-200/80 bg-slate-50/50" />
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="grid grid-cols-6 items-center gap-4 border-b border-slate-100 px-6 py-4"
            >
              <div className="h-4.5 w-3/4 rounded bg-slate-200/70" />
              <div className="h-4.5 w-1/2 rounded bg-slate-200/70" />
              <div className="h-5 w-16 rounded-md bg-slate-200/70" />
              <div className="h-4.5 w-20 rounded bg-slate-200/70" />
              <div className="h-6 w-20 rounded-full bg-slate-200/70" />
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
          Failed to load fee structures
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Something went wrong while fetching the list. Please try again.
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
  if (!feeStructures.length) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-14 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Layers className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-900">
          No fee structures found
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Try changing your filters or create a new fee structure.
        </p>
      </div>
    );
  }

  // 4. Main Table View
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th scope="col" className="px-6 py-3.5">
                Academic Year
              </th>
              <th scope="col" className="px-6 py-3.5">
                Class
              </th>
              <th scope="col" className="px-6 py-3.5">
                Fee Type
              </th>
              <th scope="col" className="px-6 py-3.5">
                Amount
              </th>
              <th scope="col" className="px-6 py-3.5">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {feeStructures.map((feeStructure) => {
              const isActive = feeStructure.status === "ACTIVE";

              return (
                <tr
                  key={feeStructure._id}
                  className="group transition-colors duration-150 hover:bg-slate-50/80"
                >
                  {/* Academic Year */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-100/60 bg-indigo-50 font-semibold text-indigo-600">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                          {feeStructure.academicYearId?.name || "—"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Class Name */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-slate-100/80 px-2.5 py-1 font-sans text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-200/50">
                      {feeStructure.classId?.name || "—"}
                    </span>
                  </td>

                  {/* Fee Type */}
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                      {feeStructure.feeType}
                    </span>
                  </td>

                  {/* Amount */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                      <Banknote className="h-4 w-4 text-emerald-600" />
                      <span>
                        NPR {feeStructure.amount?.toLocaleString() ?? 0}
                      </span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                          : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          isActive ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      {feeStructure.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView?.(feeStructure)}
                        title="View Fee Structure"
                        className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit?.(feeStructure)}
                        title="Edit Fee Structure"
                        className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleStatus?.(feeStructure)}
                        title={isActive ? "Deactivate" : "Activate"}
                        className={`cursor-pointer rounded-lg p-2 transition-colors ${
                          isActive
                            ? "text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                            : "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
                        }`}
                      >
                        <Power className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeeStructureTable;
