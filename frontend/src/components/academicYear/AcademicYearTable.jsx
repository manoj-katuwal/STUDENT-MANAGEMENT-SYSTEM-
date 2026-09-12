import {
  Calendar,
  Eye,
  Pencil,
  Power,
} from "lucide-react";
import formatDate from "../../utils/formatDate";
import AcademicYearError from "./AcademicYearError";
import AcademicYearLoading from "./AcademicYearLoading";

const AcademicYearTable = ({
  academicYears = [],
  isLoading = false,
  isError = false,
  onRetry,
  onView,
  onEdit,
  onToggleStatus,
}) => {
  if (isLoading) {
    return <AcademicYearLoading />;
  }

  if (isError) {
    return <AcademicYearError onRetry={onRetry} />;
  }

  // 3. Empty State
  if (academicYears.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-14 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Calendar className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-sm font-semibold text-slate-900">
          No academic years found
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          Try adjusting your search or filters to find what you are looking for.
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
                  key={year._id}
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
                      <span>{year.startDate ? formatDate(year.startDate) : "—"}</span>
                    </div>
                  </td>

                  {/* End Date */}
                  <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{year.endDate ? formatDate(year.endDate) : "—"}</span>
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
                        onClick={() => onView?.(year)}
                        title="View Details"
                        className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onEdit?.(year)}
                        title="Edit Academic Year"
                        className="cursor-pointer rounded-lg p-2 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onToggleStatus?.(year)}
                        disabled={year.isCurrent}
                        title={
                          year.isCurrent
                            ? "Current academic year cannot be deactivated"
                            : isActive
                              ? "Deactivate"
                              : "Activate"
                        }
                        className={`rounded-lg p-2 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                          isActive
                            ? "cursor-pointer text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                            : "cursor-pointer text-slate-400 hover:bg-emerald-50 hover:text-emerald-600"
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
