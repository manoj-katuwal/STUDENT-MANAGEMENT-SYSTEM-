import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Layers,
  GraduationCap,
  Code,
  AlertCircle,
  RefreshCw,
  Info,
  Pencil, // Added Pencil Icon
} from "lucide-react";
import { useSection } from "../../features/sections/section.hook";

const SectionDetailsPage = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  const { data: section, isLoading, isError, refetch } = useSection(sectionId);

  // Edit action handler
  const handleEdit = () => {
    // Navigate to edit route or trigger edit modal state
    navigate(`/sections/${sectionId}/edit`);
  };

  // Loading State with Skeleton
  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-6 p-6">
        <div className="h-6 w-24 animate-pulse rounded bg-slate-200" />
        <div className="h-20 animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6" />
        <div className="h-64 animate-pulse rounded-2xl border border-slate-200/80 bg-white p-6" />
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50/50 p-8 text-center shadow-xs">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-base font-semibold text-slate-900">
            Failed to load section details
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Something went wrong while fetching the details.
          </p>
          <button
            type="button"
            onClick={refetch}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-red-700 shadow-xs ring-1 ring-inset ring-red-200 transition-all hover:bg-red-50 cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!section) {
    return (
      <div className="mx-auto max-w-md p-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
          <Info className="h-6 w-6" />
        </div>
        <h3 className="mt-3 text-base font-semibold text-slate-900">
          Section not found
        </h3>
        <p className="mt-1 text-xs text-slate-500">
          The requested section record does not exist or was removed.
        </p>
        <button
          type="button"
          onClick={() => navigate("/sections")}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-xs font-medium text-white shadow-xs hover:bg-slate-800 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Go Back</span>
        </button>
      </div>
    );
  }

  const isActive = section.status === "ACTIVE";

  const details = [
    {
      label: "Section Name",
      value: section.name,
      icon: Layers,
      highlight: true,
    },
    {
      label: "Class Name",
      value: section.classId?.name || "—",
      icon: GraduationCap,
    },
    {
      label: "Class Code",
      value: section.classId?.code || "—",
      icon: Code,
      isCode: true,
    },
    {
      label: "Status",
      value: section.status,
      isStatus: true,
    },
    {
      label: "Created Date",
      value: section.createdAt
        ? new Date(section.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "—",
      icon: Calendar,
    },
    {
      label: "Last Updated",
      value: section.updatedAt
        ? new Date(section.updatedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "—",
      icon: Clock,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* Navigation & Header */}
      <div>
        <button
          type="button"
          onClick={() => navigate("/sections")}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Sections</span>
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 font-bold text-lg text-indigo-600 border border-indigo-100">
              {section.name ? section.name.charAt(0).toUpperCase() : "S"}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                  Section {section.name}
                </h1>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    isActive
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                      : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? "bg-emerald-500" : "bg-slate-400"
                    }`}
                  />
                  {section.status}
                </span>
              </div>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Detailed view and configuration for this academic section.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleEdit}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-indigo-700 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <Pencil className="h-3.5 w-3.5" />
              <span>Edit Section</span>
            </button>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6">
          Academic Overview
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {details.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" />}
                  <span className="uppercase tracking-wider">{item.label}</span>
                </div>

                <div className="mt-2">
                  {item.isStatus ? (
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        isActive
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                          : "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/10"
                      }`}
                    >
                      {item.value}
                    </span>
                  ) : item.isCode ? (
                    <span className="inline-flex items-center rounded-md bg-slate-100/80 px-2 py-0.5 text-xs font-mono font-medium text-slate-700 ring-1 ring-inset ring-slate-200/60">
                      {item.value}
                    </span>
                  ) : (
                    <p
                      className={`text-sm font-semibold ${
                        item.highlight ? "text-indigo-600" : "text-slate-900"
                      }`}
                    >
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SectionDetailsPage;
