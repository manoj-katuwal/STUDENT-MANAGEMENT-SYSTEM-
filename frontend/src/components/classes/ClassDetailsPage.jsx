import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Pencil,
  Power,
  ShieldCheck,
} from "lucide-react";

import {
  useClass,
  useUpdateClassStatus,
} from "../../features/classes/class.hooks";
import formatDate from "../../utils/formatDate";
import ConfirmModal from "../common/ConfirmModal";

// Reusable detail field component
const DetailField = ({ label, value }) => (
  <div>
    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
      {label}
    </p>
    <p className="text-sm font-medium text-slate-800">
      {value || (
        <span className="font-normal text-slate-400">Not provided</span>
      )}
    </p>
  </div>
);

// Reusable section card component
const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
    <div className="mb-4 flex items-center gap-2">
      <Icon className="h-4 w-4 text-slate-400" />
      <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
    </div>
    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      {children}
    </div>
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

  // Loading Skeleton aligned with StudentDetailsPage
  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-6 animate-pulse">
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
          <div className="mb-4 h-4 w-16 rounded bg-slate-200" />
          <div className="h-6 w-56 rounded bg-slate-200" />
          <div className="mt-2 h-4 w-40 rounded bg-slate-200" />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm">
          <div className="mb-5 h-4 w-40 rounded bg-slate-200" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-2 h-3 w-24 rounded bg-slate-200" />
              <div className="h-4 w-32 rounded bg-slate-200" />
            </div>
            <div>
              <div className="mb-2 h-3 w-16 rounded bg-slate-200" />
              <div className="h-4 w-24 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-800">
            Failed to load class details
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {error?.message || "Something went wrong while loading the class."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isActive = classRecord?.status === "ACTIVE";
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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

  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 py-6">
      {/* Header Card */}
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
        <button
          onClick={() => navigate("/classes")}
          className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {classRecord?.name}
              </h1>
              <span
                className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                  isActive
                    ? "border-emerald-100 bg-emerald-50 text-emerald-600"
                    : "border-slate-200 bg-slate-100 text-slate-500"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              Class Code: {classRecord?.code || "N/A"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={updateStatusMutation.isPending}
              onClick={handleToggleStatus}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                isActive
                  ? "border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100"
                  : "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
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
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200"
            >
              <Pencil className="h-4 w-4" />
              <span>Edit Class</span>
            </button>
          </div>
        </div>
      </div>

      {updateStatusMutation.isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {updateStatusMutation.error?.response?.data?.message ||
            "Failed to update class status. Please try again."}
        </div>
      )}

      {/* Basic Class Information Card */}
      <SectionCard icon={BookOpen} title="Class Information">
        <DetailField label="Class Name" value={classRecord?.name} />
        <DetailField
          label="Class Code"
          value={
            classRecord?.code ? (
              <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-xs text-slate-700">
                {classRecord.code}
              </span>
            ) : null
          }
        />
      </SectionCard>

      {/* System Metadata Card */}
      <SectionCard icon={Calendar} title="System Details">
        <DetailField
          label="Created Date"
          value={
            classRecord?.createdAt
              ? formatDate
                ? formatDate(classRecord.createdAt)
                : new Date(classRecord.createdAt).toLocaleDateString()
              : null
          }
        />
        <DetailField
          label="Status Flag"
          value={isActive ? "Active Class" : "Inactive Class"}
        />
      </SectionCard>

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
  );
};

export default ClassDetailsPage;
