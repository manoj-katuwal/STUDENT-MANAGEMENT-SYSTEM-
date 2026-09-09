import React from "react";
import {
  CheckCircle2,
  Edit,
  Eye,
  Power,
  RefreshCw,
  XCircle,
} from "lucide-react";

const ClassTable = ({
  classes = [],
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
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="animate-pulse">
          <div className="h-12 border-b border-slate-200 bg-slate-50/50" />
          {[1, 2, 3, 4, 5].map((row) => (
            <div
              key={row}
              className="flex items-center justify-between border-b border-slate-100 px-6 py-4 last:border-b-0"
            >
              <div className="h-4 w-1/4 rounded bg-slate-200" />
              <div className="h-4 w-1/6 rounded bg-slate-200" />
              <div className="h-6 w-20 rounded-full bg-slate-200" />
              <div className="h-4 w-1/6 rounded bg-slate-200" />
              <div className="h-8 w-24 rounded-lg bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <XCircle className="h-6 w-6 text-red-500" />
        </div>
        <h3 className="mt-3 text-base font-semibold text-slate-900">
          Failed to load classes
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Something went wrong while fetching the class list. Please try again.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-slate-800 active:scale-95"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

//   3. Empty State
  if (classes.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
          <Eye className="h-6 w-6 text-slate-400" />
        </div>
        <h3 className="mt-3 text-base font-semibold text-slate-900">
          No classes found
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Try adjusting your search or filters to find what you are looking for.
        </p>
      </div>
    );
  }

  // 4. Main Table View
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50/60">
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Class
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Code
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Status
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                Created Date
              </th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 bg-white">
            {classes.map((classRecord) => {
              const isActive = classRecord.status === "ACTIVE";

              return (
                <tr
                  key={classRecord._id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-slate-900">
                      {classRecord.name}
                    </p>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-mono font-medium text-slate-700 border border-slate-200">
                      {classRecord.code}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                          : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10"
                      }`}
                    >
                      {isActive ? (
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5 text-slate-400" />
                      )}
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {classRecord.createdAt
                      ? new Date(classRecord.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )
                      : "—"}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView && onView(classRecord)}
                        title="View Class"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-blue-600 active:scale-95"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit && onEdit(classRecord)}
                        title="Edit Class"
                        className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-amber-600 active:scale-95"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onToggleStatus && onToggleStatus(classRecord)
                        }
                        title={isActive ? "Deactivate" : "Activate"}
                        className={`rounded-lg p-2 transition active:scale-95 ${
                          isActive
                            ? "text-slate-500 hover:bg-red-50 hover:text-red-600"
                            : "text-slate-500 hover:bg-emerald-50 hover:text-emerald-600"
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

export default ClassTable;
