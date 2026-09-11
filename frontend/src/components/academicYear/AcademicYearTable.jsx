import React from "react";
import { Calendar, Eye, Pencil, Power } from "lucide-react";

const AcademicYearTable = () => {
  const academicYears = [
    {
      id: 1,
      name: "2082/83",
      startDate: "2025-04-14",
      endDate: "2026-04-13",
      status: "ACTIVE",
      isCurrent: true,
    },
    {
      id: 2,
      name: "2081/82",
      startDate: "2024-04-14",
      endDate: "2025-04-13",
      status: "ACTIVE",
      isCurrent: false,
    },
    {
      id: 3,
      name: "2080/81",
      startDate: "2023-04-14",
      endDate: "2024-04-13",
      status: "INACTIVE",
      isCurrent: false,
    },
  ];

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
                Start Date
              </th>
              <th scope="col" className="px-6 py-3.5">
                End Date
              </th>
              <th scope="col" className="px-6 py-3.5">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5">
                Current
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {academicYears.map((year) => {
              const isActive = year.status === "ACTIVE";

              return (
                <tr
                  key={year.id}
                  className="group transition-colors duration-150 hover:bg-slate-50/80"
                >
                  {/* Academic Year Name */}
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-indigo-100/60 bg-indigo-50 font-semibold text-indigo-600">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900 transition-colors group-hover:text-indigo-600">
                          {year.name}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Start Date */}
                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{year.startDate}</span>
                    </div>
                  </td>

                  {/* End Date */}
                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{year.endDate}</span>
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
                      {year.status}
                    </span>
                  </td>

                  {/* Current Badge */}
                  <td className="whitespace-nowrap px-6 py-4">
                    {year.isCurrent ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-600/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                        CURRENT
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        title="View Details"
                        className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        title="Edit Academic Year"
                        className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
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

export default AcademicYearTable;
