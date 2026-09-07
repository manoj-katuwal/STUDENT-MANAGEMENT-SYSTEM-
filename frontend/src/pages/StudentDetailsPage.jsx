import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, GraduationCap, Users } from "lucide-react";
import { useStudent } from "../features/students/student.hooks";
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
  const { data: student, isLoading, isError, error } = useStudent(studentId);


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
      <div className="max-w-4xl mx-auto py-6 px-4">
        <p className="text-sm text-red-600">
          {error?.message || "Failed to load student"}
        </p>
      </div>
    );
  }

  const isActive = student?.status === "ACTIVE";

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <div className="flex items-center flex-wrap gap-3">
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

      {/* Personal Information */}
      <SectionCard icon={User} title="Personal Information">
        <DetailField label="Date of Birth" value={formatDate(student?.dateOfBirth)} />
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
