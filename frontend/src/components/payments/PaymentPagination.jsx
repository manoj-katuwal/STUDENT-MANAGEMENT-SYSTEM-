import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PaymentPagination = ({ page, totalPages, total, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200/80 bg-white px-6 py-4 shadow-sm rounded-b-xl">
      {/* Total Count & Current Page Text */}
      <div className="text-sm text-slate-600 font-normal">
        Showing page{" "}
        <span className="font-semibold text-slate-900">{page}</span> of{" "}
        <span className="font-semibold text-slate-900">{totalPages}</span>
        <span className="mx-2 text-slate-300">|</span>
        <span className="text-slate-500">
          <span className="font-medium text-slate-700">{total}</span> total
          payments
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-700 disabled:active:scale-100"
        >
          <ChevronLeft className="h-4 w-4 text-slate-500" />
          <span>Previous</span>
        </button>

        <button
          type="button"
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-950/10 disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-white disabled:hover:border-slate-200 disabled:hover:text-slate-700 disabled:active:scale-100"
        >
          <span>Next</span>
          <ChevronRight className="h-4 w-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
};

export default PaymentPagination;
