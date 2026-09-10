import React from "react";
import {
  Eye,
  Pencil,
  Power,
  Layers,
  Calendar,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

const SectionTable = ({
  sections = [],
  isLoading = false,
  isError = false,
  onRetry,
  onView,
  onEdit,
  onToggleStatus,
}) => {
  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        <div className="animate-pulse">
          <div className="h-12 border-b border-slate-200/80 bg-slate-50/50" />
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="grid grid-cols-6 items-center gap-4 border-b border-slate-100 px-6 py-4"
            >
              <div className="h-4.5 w-3/4 rounded bg-slate-200/70" />
              <div className="h-4.5 w-2/3 rounded bg-slate-200/70" />
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

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-base font-semibold text-slate-900">
          Failed to load sections
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Something went wrong while fetching section data. Please try again.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-red-700 shadow-xs ring-1 ring-inset ring-red-200 transition-all hover:bg-red-50 cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-14 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Layers className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-900">
          No sections found
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Try changing your search keywords or class filter.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th scope="col" className="px-6 py-3.5">
                Section Name
              </th>
              <th scope="col" className="px-6 py-3.5">
                Class
              </th>
              <th scope="col" className="px-6 py-3.5">
                Code
              </th>
              <th scope="col" className="px-6 py-3.5">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5">
                Created Date
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {sections.map((section) => {
              const isActive = section.status === "ACTIVE";

              return (
                <tr
                  key={section._id}
                  className="group transition-colors duration-150 hover:bg-slate-50/80"
                >
                  {/* Section Name */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-semibold text-indigo-600 border border-indigo-100/60">
                        {section.name
                          ? section.name.charAt(0).toUpperCase()
                          : "S"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {section.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Class Name */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <p className="text-sm font-medium text-slate-700">
                      {section.classId?.name || "—"}
                    </p>
                  </td>

                  {/* Class Code */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-slate-100/80 px-2 py-0.5 text-xs font-medium font-mono text-slate-600 ring-1 ring-inset ring-slate-200/50">
                      {section.classId?.code || "—"}
                    </span>
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
                      {section.status}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>
                        {section.createdAt
                          ? new Date(section.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onView?.(section)}
                        title="View Details"
                        className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit?.(section)}
                        title="Edit Section"
                        className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleStatus?.(section)}
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

export default SectionTable;
