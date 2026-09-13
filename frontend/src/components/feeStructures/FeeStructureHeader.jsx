import { Upload, Plus } from "lucide-react";

const FeeStructureHeader = ({ onAdd, onExport, isExporting = false }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4 md:px-6 md:py-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left side: Title & Description */}
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Fee Structures
          </h1>
          <p className="text-sm text-slate-500 max-w-md">
            Configure tuition, transport, and examination fees for each class
            and academic year.
          </p>
        </div>

        {/* Right side: Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onExport}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span>{isExporting ? "Exporting..." : "Export CSV"}</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium rounded-lg shadow-sm transition-colors cursor-pointer"
            onClick={onAdd}
          >
            <Plus className="w-4 h-4" />
            <span>Add Fee Structure</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeeStructureHeader;
