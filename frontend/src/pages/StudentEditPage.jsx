import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, GraduationCap, Users } from "lucide-react";
import { useStudent } from "../features/students/student.hooks";

// Reusable section shell — same visual pattern as StudentDetailsPage's SectionCard
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

// Reusable label + input wrapper
const FormField = ({ label, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);

const inputClass =
  "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";

const StudentEditPage = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const { data: student, isLoading, isError, error } = useStudent(studentId);

  const [formData, setFormData] = useState({
    name: "",
    admissionNumber: "",
    dateOfBirth: "",
    gender: "",
    phone: "",
    address: "",
    classId: "",
    sectionId: "",
    guardianName: "",
    guardianRelationship: "",
    guardianPhone: "",
  });

  useEffect(() => {
    if (!student) return;

    setFormData({
      name: student.name || "",
      admissionNumber: student.admissionNumber || "",
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.slice(0, 10) : "",
      gender: student.gender || "",
      phone: student.phone || "",
      address: student.address || "",
      classId: student.classId?._id || "",
      sectionId: student.sectionId?._id || "",
      guardianName: student.guardian?.name || "",
      guardianRelationship: student.guardian?.relationship || "",
      guardianPhone: student.guardian?.phone || "",
    });
  }, [student]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // No API call yet — wiring comes in a later step
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-6 px-4">
        <p className="text-sm text-slate-500">Loading student...</p>
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

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4">
        <button
          type="button"
          onClick={() => navigate(`/students/${studentId}`)}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Edit Student
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <SectionCard icon={User} title="Personal Information">
          <FormField label="Student Name">
            <input
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              className={inputClass}
            />
          </FormField>

          <FormField label="Admission Number">
            <input
              type="text"
              value={formData.admissionNumber}
              onChange={handleChange("admissionNumber")}
              className={inputClass}
            />
          </FormField>

          <FormField label="Date of Birth">
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange("dateOfBirth")}
              className={inputClass}
            />
          </FormField>

          <FormField label="Gender">
            <select
              value={formData.gender}
              onChange={handleChange("gender")}
              className={inputClass}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </FormField>

          <FormField label="Phone">
            <input
              type="text"
              value={formData.phone}
              onChange={handleChange("phone")}
              className={inputClass}
            />
          </FormField>

          <FormField label="Address">
            <input
              type="text"
              value={formData.address}
              onChange={handleChange("address")}
              className={inputClass}
            />
          </FormField>
        </SectionCard>

        {/* Academic Information */}
        <SectionCard icon={GraduationCap} title="Academic Information">
          <FormField label="Class">
            <select
              value={formData.classId}
              onChange={handleChange("classId")}
              className={inputClass}
            >
              <option value="">Select Class</option>
              {/* options will come from real class data in a later step */}
            </select>
          </FormField>

          <FormField label="Section">
            <select
              value={formData.sectionId}
              onChange={handleChange("sectionId")}
              className={inputClass}
            >
              <option value="">Select Section</option>
              {/* options will come from real section data in a later step */}
            </select>
          </FormField>
        </SectionCard>

        {/* Guardian Information */}
        <SectionCard icon={Users} title="Guardian Information">
          <FormField label="Guardian Name">
            <input
              type="text"
              value={formData.guardianName}
              onChange={handleChange("guardianName")}
              className={inputClass}
            />
          </FormField>

          <FormField label="Relationship">
            <input
              type="text"
              value={formData.guardianRelationship}
              onChange={handleChange("guardianRelationship")}
              className={inputClass}
            />
          </FormField>

          <FormField label="Guardian Phone">
            <input
              type="text"
              value={formData.guardianPhone}
              onChange={handleChange("guardianPhone")}
              className={inputClass}
            />
          </FormField>
        </SectionCard>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(`/students/${studentId}`)}
            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentEditPage;
