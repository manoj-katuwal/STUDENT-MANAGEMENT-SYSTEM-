import { ChevronLeft, ChevronRight } from "lucide-react";

const UsersPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  limit,
  hasNextPage,
  hasPrevPage,
  totalUsers,
}) => {
  if (!totalUsers || totalUsers === 0) return null;

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalUsers);

  // Helper function to generate page numbers with ellipsis for large page counts
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between font-body border-t border-gray-200/80 pt-4">
      {/* Items count summary */}
      <p className="text-xs sm:text-sm text-gray-500 font-medium">
        Showing{" "}
        <span className="font-semibold text-gray-900">
          {start} - {end}
        </span>{" "}
        of <span className="font-semibold text-gray-900">{totalUsers}</span>{" "}
        users
      </p>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          {/* Previous Button */}
          <button
            type="button"
            disabled={!hasPrevPage}
            onClick={() => onPageChange(currentPage - 1)}
            aria-label="Previous page"
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers.map((page, idx) => {
              if (page === "...") {
                return (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 py-1 text-xs text-gray-400 font-medium select-none"
                  >
                    ...
                  </span>
                );
              }

              const isActive = page === currentPage;

              return (
                <button
                  key={page}
                  type="button"
                  onClick={() => !isActive && onPageChange(page)}
                  disabled={isActive}
                  aria-label={`Page ${page}`}
                  aria-current={isActive ? "page" : undefined}
                  className={`min-w-8 h-8 rounded-lg px-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? "cursor-default bg-blue-600 text-white shadow-xs"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next Button */}
          <button
            type="button"
            disabled={!hasNextPage}
            onClick={() => onPageChange(currentPage + 1)}
            aria-label="Next page"
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-xs transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersPagination;
