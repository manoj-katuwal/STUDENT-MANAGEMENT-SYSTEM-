import React from "react";
import {
  X,
  Calendar,
  GraduationCap,
  Banknote,
  Clock,
  CheckCircle2,
  XCircle,
  Tag,
} from "lucide-react";

const ViewFeeStructureModal = ({ feeStructure, onClose }) => {
  if (!feeStructure) return null;

  const isActive = feeStructure.status === "ACTIVE";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl transition-all">
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Banknote className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Fee Structure Details
              </h2>
              <p className="text-xs text-slate-500">
                Full breakdown of configured fees and status
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Key Metric Card (Amount Highlight) */}
          <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Amount
              </span>
              <div className="mt-0.5 text-2xl font-extrabold text-slate-900">
                NPR {feeStructure.amount?.toLocaleString() ?? 0}
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                  : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10"
              }`}
            >
              {isActive ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <XCircle className="h-3.5 w-3.5 text-slate-400" />
              )}
              {feeStructure.status}
            </span>
          </div>

          {/* Detailed Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Academic Year */}
            <div className="rounded-xl border border-slate-100 p-3.5 transition-colors hover:border-slate-200">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Academic Year
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {feeStructure.academicYearId?.name ||
                  feeStructure.academicYearId ||
                  "—"}
              </p>
            </div>

            {/* Class */}
            <div className="rounded-xl border border-slate-100 p-3.5 transition-colors hover:border-slate-200">
              <div className="flex items-center gap-2 text-slate-400">
                <GraduationCap className="h-4 w-4 text-slate-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Class
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900">
                {feeStructure.classId?.name || feeStructure.classId || "—"}
              </p>
            </div>

            {/* Fee Type */}
            <div className="rounded-xl border border-slate-100 p-3.5 transition-colors hover:border-slate-200">
              <div className="flex items-center gap-2 text-slate-400">
                <Tag className="h-4 w-4 text-slate-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Fee Type
                </span>
              </div>
              <div className="mt-2">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {feeStructure.feeType}
                </span>
              </div>
            </div>

            {/* Created Date */}
            <div className="rounded-xl border border-slate-100 p-3.5 transition-colors hover:border-slate-200">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="h-4 w-4 text-slate-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider">
                  Created At
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-700">
                {feeStructure.createdAt
                  ? new Date(feeStructure.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      },
                    )
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end border-t border-slate-100 bg-slate-50/50 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewFeeStructureModal;
