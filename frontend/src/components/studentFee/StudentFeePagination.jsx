import { ChevronLeft, ChevronRight } from "lucide-react";

const StudentFeePagination = ({
  pagination,
  onPageChange,
  isLoading = false,
}) => {
  const { page = 1, totalPages = 1, total = 0, limit = 10 } = pagination ?? {};

  if (!pagination || (totalPages <= 1 && page <= 1)) {
    return null;
  }

  const startItem = total === 0 ? 0 : (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs font-medium text-slate-500 sm:text-sm">
        Showing{" "}
        <span className="font-semibold text-slate-700">
          {startItem}-{endItem}
        </span>{" "}
        of <span className="font-semibold text-slate-700">{total}</span> fee
        records
      </p>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="text-xs font-medium text-slate-500">
          Page <span className="text-slate-700">{page}</span> of{" "}
          <span className="text-slate-700">{totalPages}</span>
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isLoading || page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </button>
          <button
            type="button"
            disabled={isLoading || page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentFeePagination
