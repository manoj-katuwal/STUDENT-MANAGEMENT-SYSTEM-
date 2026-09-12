import { AlertCircle, RefreshCw } from "lucide-react";

const AcademicYearError = ({ onRetry }) => {
  return (
    <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center shadow-xs">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="mt-3 text-base font-semibold text-slate-900">
        Failed to load academic years
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Something went wrong while fetching the academic years list. Please try
        again.
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-red-700 shadow-xs ring-1 ring-inset ring-red-200 transition-all hover:bg-red-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Loading</span>
        </button>
      )}
    </div>
  );
};

export default AcademicYearError;
