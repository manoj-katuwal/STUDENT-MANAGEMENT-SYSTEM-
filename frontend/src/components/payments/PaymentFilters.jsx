import {
  Search,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

const PaymentFilters = ({
  search,
  onSearchChange,
  paymentMethod,
  onPaymentMethodChange,
  
}) => {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Search Input */}
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 stroke-[2.2]" />
          <input
            type="text"
            placeholder="Search student, admission no., or transaction ID..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10"
          />
        </div>

        {/* Filter Dropdowns & Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Payment Method Select */}
          <div className="relative">
            <select
              value={paymentMethod || ""}
              onChange={(e) => onPaymentMethodChange(e.target.value)}
              className="h-10 appearance-none rounded-xl border border-slate-200 bg-slate-50/50 pl-3.5 pr-9 text-xs sm:text-sm font-medium text-slate-700 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer"
            >
              <option value="">All Methods</option>
              <option value="CASH">Cash</option>
              <option value="BANK_TRANSFER">Bank Transfer</option>
              <option value="CHEQUE">Cheque</option>
              <option value="ESEWA">eSewa</option>
              <option value="KHALTI">Khalti</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Status Select */}
          <div className="relative">
            <select className="h-10 appearance-none rounded-xl border border-slate-200 bg-slate-50/50 pl-3.5 pr-9 text-xs sm:text-sm font-medium text-slate-700 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer">
              <option>All Statuses</option>
              <option>Success</option>
              <option>Pending</option>
              <option>Failed</option>
              <option>Reversed</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* Payment Type Select */}
          <div className="relative">
            <select className="h-10 appearance-none rounded-xl border border-slate-200 bg-slate-50/50 pl-3.5 pr-9 text-xs sm:text-sm font-medium text-slate-700 transition-all focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/10 cursor-pointer">
              <option>All Types</option>
              <option>Tuition Fee</option>
              <option>Admission Fee</option>
              <option>Exam Fee</option>
              <option>Transport Fee</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>

          {/* More Filters Button */}
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:scale-95 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-slate-500 stroke-[2.2]" />
            <span>More</span>
          </button>

          {/* Reset Button */}
          <button
            type="button"
            title="Reset Filters"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50/50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 active:scale-95 transition-all cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5 stroke-[2.2]" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFilters;
