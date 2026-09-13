const FeeStructurePagination = ({ pagination, onPageChange }) => {
  const { page = 1, totalPages = 1, total = 0 } = pagination ?? {};

  // Keep the Previous button available when the current page becomes invalid
  // after the total number of records changes.
  if (!pagination || (totalPages <= 1 && page <= 1)) {
    return null;
  }

  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3">
      <p className="text-sm text-slate-500">
        Showing page <span className="font-medium text-slate-700">{page}</span>{" "}
        of <span className="font-medium text-slate-700">{totalPages}</span> ·{" "}
        <span className="font-medium text-slate-700">{total}</span> total items
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FeeStructurePagination;
