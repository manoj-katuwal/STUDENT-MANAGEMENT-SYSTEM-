import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const StudentPagination = ({ page = 1, totalPages = 1, onPageChange }) => {
  // Generate simple array of page numbers from 1 to totalPages
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 bg-white border border-slate-200 rounded-xl shadow-sm font-sans">
      {/* Page Info */}
      <div className="text-xs font-medium text-slate-500">
        Page <span className="font-semibold text-slate-800">{page}</span> of{' '}
        <span className="font-semibold text-slate-800">{totalPages}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {pages.map((pageNum) => {
            const isActive = pageNum === page;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default StudentPagination;
