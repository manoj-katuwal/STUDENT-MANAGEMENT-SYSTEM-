import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Pencil,
  Power,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  Sparkles,
  Info,
} from "lucide-react";

import {
  useClass,
  useUpdateClassStatus,
} from "../../features/classes/class.hooks";
import formatDate from "../../utils/formatDate";
import ConfirmModal from "../common/ConfirmModal";

// Reusable detail field component
const DetailField = ({ label, value, subtext }) => (
  <div className="space-y-1">
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
      {label}
    </p>
    <div className="text-sm font-semibold text-slate-800">
      {value || (
        <span className="font-normal italic text-slate-400">Not provided</span>
      )}
    </div>
    {subtext && <p className="text-xs text-slate-500">{subtext}</p>}
  </div>
);

// Reusable section card component
const SectionCard = ({ icon: Icon, title, description, children, badge }) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all hover:shadow-md">
    <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 ring-1 ring-indigo-500/10">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-900">{title}</h2>
          {description && (
            <p className="text-xs text-slate-500">{description}</p>
          )}
        </div>
      </div>
      {badge}
    </div>
    <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">{children}</div>
  </div>
);

const ClassDetailsPage = () => {
  const { classId } = useParams();
  const navigate = useNavigate();

  const {
    data: classRecord,
    isLoading,
    isError,
    error,
    refetch,
  } = useClass(classId);

  const updateStatusMutation = useUpdateClassStatus();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50/60 p-4 sm:p-8">
        <div className="mx-auto max-w-5xl space-y-6">
          <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
          <div className="h-32 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm animate-pulse" />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="h-48 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2 animate-pulse" />
            <div className="h-48 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-8 text-center shadow-xl shadow-slate-200/50">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 ring-8 ring-rose-50/50">
            <AlertTriangle className="h-7 w-7 text-rose-600" />
          </div>
          <h3 className="mt-5 text-lg font-bold text-slate-900">
            Failed to load class details
          </h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            {error?.message ||
              "Something went wrong while loading the class records."}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex justify-center items-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-[0.98]"
            >
              Try Again
            </button>
            <button
              type="button"
              onClick={() => navigate("/classes")}
              className="inline-flex justify-center items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.98]"
            >
              Back to Classes
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isActive = classRecord?.status === "ACTIVE";

  const handleToggleStatus = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmStatusChange = () => {
    const nextStatus = isActive ? "INACTIVE" : "ACTIVE";

    updateStatusMutation.mutate(
      {
        classId,
        status: nextStatus,
      },
      {
        onSettled: () => {
          setIsConfirmOpen(false);
        },
      },
    );
  };

  const formattedCreatedDate = classRecord?.createdAt
    ? formatDate
      ? formatDate(classRecord.createdAt)
      : new Date(classRecord.createdAt).toLocaleDateString()
    : null;

  return (
    <div className="min-h-screen bg-slate-50/60 p-4 sm:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Navigation & Header Actions */}
        <div className="space-y-4">
          <button
            onClick={() => navigate("/classes")}
            className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500 transition hover:text-indigo-600"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Classes
          </button>
        </div>

        {/* Hero Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-slate-200/40">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {classRecord?.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                      : "bg-slate-100 text-slate-600 ring-slate-500/20"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {isActive ? "Active Class" : "Inactive Class"}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <span>Class Code:</span>
                <span className="font-mono text-xs font-semibold text-slate-700 rounded bg-slate-100 px-2 py-0.5 border border-slate-200">
                  {classRecord?.code || "N/A"}
                </span>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 sm:border-0 sm:pt-0">
              <button
                type="button"
                disabled={updateStatusMutation.isPending}
                onClick={handleToggleStatus}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition active:scale-[0.98] disabled:opacity-50 ${
                  isActive
                    ? "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100/80"
                    : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80"
                }`}
              >
                <Power className="h-4 w-4" />
                <span>
                  {updateStatusMutation.isPending
                    ? "Updating..."
                    : isActive
                      ? "Deactivate Class"
                      : "Activate Class"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => navigate(`/classes/${classId}/edit`)}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-500 active:scale-[0.98]"
              >
                <Pencil className="h-4 w-4" />
                <span>Edit Class</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Mutation Error Banner */}
        {updateStatusMutation.isError && (
          <div className="flex items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm font-medium text-rose-800 backdrop-blur-sm">
            <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
            <span>
              {updateStatusMutation.error?.response?.data?.message ||
                "Failed to update class status. Please try again."}
            </span>
          </div>
        )}

        {/* Multi-Column Details Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Information Column */}
          <div className="space-y-6 lg:col-span-2">
            <SectionCard
              icon={BookOpen}
              title="Class Information"
              description="Primary identifiers and organizational attributes"
            >
              <DetailField
                label="Class Name"
                value={classRecord?.name}
                subtext="Official administrative title"
              />
              <DetailField
                label="Unique Code"
                value={
                  classRecord?.code ? (
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-800 ring-1 ring-inset ring-slate-300">
                      {classRecord.code}
                    </span>
                  ) : null
                }
                subtext="System tracking reference"
              />
            </SectionCard>

            <SectionCard
              icon={Calendar}
              title="System Details"
              description="Audit trail and creation metadata"
            >
              <DetailField
                label="Created Date"
                value={
                  formattedCreatedDate ? (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      {formattedCreatedDate}
                    </span>
                  ) : null
                }
              />
              <DetailField
                label="Status Flag"
                value={
                  isActive ? (
                    <span className="flex items-center gap-1.5 text-emerald-700">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />{" "}
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <XCircle className="h-4 w-4 text-slate-400" /> Inactive
                    </span>
                  )
                }
              />
            </SectionCard>
          </div>

          {/* Sidebar Context Card */}
          <div className="space-y-6 lg:col-span-1">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Info className="h-4 w-4 text-indigo-500" /> Management Notice
              </h3>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">
                Changing a class status affects visibility across registration
                modules, fee assignment tables, and student rosters.
              </p>
              <div className="mt-4 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Sections mapped</span>
                  <span className="font-semibold text-slate-800">
                    Available in Sections
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <ConfirmModal
          open={isConfirmOpen}
          title={isActive ? "Deactivate Class" : "Activate Class"}
          message={
            isActive
              ? `Are you sure you want to deactivate "${classRecord?.name}"? Students and fees associated with this class may be affected.`
              : `Are you sure you want to activate "${classRecord?.name}"? It will become active and accessible across the system.`
          }
          confirmText={isActive ? "Deactivate" : "Activate"}
          isLoading={updateStatusMutation.isPending}
          onConfirm={handleConfirmStatusChange}
          onCancel={() => setIsConfirmOpen(false)}
        />
      </div>
    </div>
  );
};

export default ClassDetailsPage;
