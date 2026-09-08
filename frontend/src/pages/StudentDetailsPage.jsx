import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  GraduationCap,
  Users,
  Pencil,
  Power,
} from "lucide-react";
import {
  useStudent,
  useUpdateStudentStatus,
} from "../features/students/student.hooks";
import formatDate from "../utils/formatDate";

// Small reusable field for label + value pairs inside a section card
const DetailField = ({ label, value }) => (
  <div>
    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">
      {label}
    </p>
    <p className="text-sm font-medium text-slate-800">
      {value || (
        <span className="text-slate-400 font-normal">Not provided</span>
      )}
    </p>
  </div>
);

// Section wrapper — consistent card shell used across the page
const SectionCard = ({ icon: Icon, title, children }) => (
  <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4">
    <div className="flex items-center gap-2 mb-4">
      <Icon className="w-4 h-4 text-slate-400" />
      <h2 className="text-sm font-semibold text-slate-800">{title}</h2>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
      {children}
    </div>
  </div>
);

const StudentDetailsPage = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const {
    data: student,
    isLoading,
    isError,
    error,
    refetch,
  } = useStudent(studentId);

  const updateStatusMutation = useUpdateStudentStatus();

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4 space-y-4 animate-pulse">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-5">
          <div className="h-4 w-16 bg-slate-200 rounded mb-4" />
          <div className="h-6 w-56 bg-slate-200 rounded" />
          <div className="h-4 w-40 bg-slate-200 rounded mt-2" />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-5">
          <div className="h-4 w-40 bg-slate-200 rounded mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="h-3 w-24 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-32 bg-slate-200 rounded" />
            </div>
            <div>
              <div className="h-3 w-16 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-24 bg-slate-200 rounded" />
            </div>
            <div>
              <div className="h-3 w-20 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-28 bg-slate-200 rounded" />
            </div>
            <div>
              <div className="h-3 w-20 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-40 bg-slate-200 rounded" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-5">
          <div className="h-4 w-44 bg-slate-200 rounded mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="h-3 w-16 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-32 bg-slate-200 rounded" />
            </div>
            <div>
              <div className="h-3 w-20 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-24 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-6 py-8 text-center">
          <p className="text-sm font-semibold text-slate-800">
            Failed to load student details
          </p>
          <p className="text-sm text-slate-500 mt-1">
            {error?.message ||
              "Something went wrong while loading the student."}
          </p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const isActive = student?.status === "ACTIVE";

  const handleToggleStatus = () => {
    const nextStatus = student.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

    if (
      nextStatus === "INACTIVE" &&
      !window.confirm("Are you sure you want to deactivate this student?")
    ) {
      return;
    }
    updateStatusMutation.mutate({
      studentId,
      status: isActive ? "INACTIVE" : "ACTIVE",
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4">
        <button
          onClick={() => navigate("/students")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                {student?.name}
              </h1>
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                    : "bg-slate-100 text-slate-500 border-slate-200"
                }`}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Admission No. {student?.admissionNumber}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={updateStatusMutation.isPending}
              onClick={handleToggleStatus}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 ${
                isActive
                  ? "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
              }`}
            >
              <Power className="w-4 h-4" />
              <span>
                {updateStatusMutation.isPending
                  ? "Updating..."
                  : isActive
                    ? "Deactivate Student"
                    : "Activate Student"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => navigate(`/students/${studentId}/edit`)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit Student</span>
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <SectionCard icon={User} title="Personal Information">
        <DetailField
          label="Date of Birth"
          value={formatDate(student?.dateOfBirth)}
        />
        <DetailField label="Gender" value={student?.gender} />
        <DetailField label="Phone" value={student?.phone} />
        <DetailField label="Address" value={student?.address} />
      </SectionCard>

      {/* Academic Information */}
      <SectionCard icon={GraduationCap} title="Academic Information">
        <DetailField
          label="Class"
          value={
            student?.classId?.name
              ? `${student.classId.name}${
                  student?.classId?.code ? ` (${student.classId.code})` : ""
                }`
              : null
          }
        />
        <DetailField label="Section" value={student?.sectionId?.name} />
      </SectionCard>

      {/* Guardian Information */}
      <SectionCard icon={Users} title="Guardian Information">
        <DetailField label="Guardian Name" value={student?.guardian?.name} />
        <DetailField
          label="Relationship"
          value={student?.guardian?.relationship}
        />
        <DetailField label="Guardian Phone" value={student?.guardian?.phone} />
      </SectionCard>
    </div>
  );
};

export default StudentDetailsPage;
