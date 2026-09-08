import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, GraduationCap, Users } from "lucide-react";
import { useCreateStudent } from "../features/students/student.hooks";

// Local — same pattern as StudentDetailsPage / StudentEditPage
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

const FormField = ({ label, required = false, children, error }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

const inputClass =
  "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors";

const inputErrorClass =
  "w-full px-3 py-2 border border-red-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors";

const disabledSelectClass =
  "w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 text-slate-400 cursor-not-allowed";

const disabledSelectErrorClass =
  "w-full px-3 py-2 border border-red-300 rounded-lg text-sm bg-slate-50 text-slate-400 cursor-not-allowed";

const StudentAddPage = () => {
  const navigate = useNavigate();
  const createStudentMutation = useCreateStudent();
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

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    // User ले नयाँ भ्यालु टाइप गर्दा error हत्छ
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Student name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Student name must be at least 2 characters";
    }

    if (!formData.admissionNumber.trim()) {
      newErrors.admissionNumber = "Admission number is required";
    } else if (formData.admissionNumber.trim().length < 3) {
      newErrors.admissionNumber =
        "Admission number must be at least 3 characters";
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (formData.guardianPhone && !/^[0-9]{10}$/.test(formData.guardianPhone)) {
      newErrors.guardianPhone = "Phone number must be exactly 10 digits";
    }

    if (!formData.classId) {
      newErrors.classId = "Class is required";
    }

    if (!formData.sectionId) {
      newErrors.sectionId = "Section is required";
    }

    return newErrors;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitError("");

    const payload = {
      name: formData.name.trim(),
      admissionNumber: formData.admissionNumber.trim(),
      dateOfBirth: formData.dateOfBirth || null,
      gender: formData.gender || null,
      phone: formData.phone || null,
      address: formData.address.trim() || null,
      classId: formData.classId,
      sectionId: formData.sectionId,
      guardian: {
        name: formData.guardianName.trim() || null,
        relationship: formData.guardianRelationship.trim() || null,
        phone: formData.guardianPhone || null,
      },
    };

    try {
      const student = await createStudentMutation.mutateAsync(payload);

      navigate(`/students/${student._id}`);
    } catch (error) {
      setSubmitError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create student",
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-4">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm px-5 py-4">
        <button
          type="button"
          onClick={() => navigate("/students")}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Add Student
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <SectionCard icon={User} title="Personal Information">
          <FormField label="Student Name" required error={errors.name}>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              className={errors.name ? inputErrorClass : inputClass}
            />
          </FormField>

          <FormField
            label="Admission Number"
            required
            error={errors.admissionNumber}
          >
            <input
              type="text"
              value={formData.admissionNumber}
              onChange={handleChange("admissionNumber")}
              className={errors.admissionNumber ? inputErrorClass : inputClass}
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

          <FormField label="Phone" error={errors.phone}>
            <input
              type="text"
              value={formData.phone}
              onChange={handleChange("phone")}
              className={errors.phone ? inputErrorClass : inputClass}
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
          <FormField label="Class" required error={errors.classId}>
            <select
              value={formData.classId}
              disabled
              className={
                errors.classId ? disabledSelectErrorClass : disabledSelectClass
              }
            >
              <option value="">Class Module coming soon</option>
            </select>
          </FormField>

          <FormField label="Section" required error={errors.sectionId}>
            <select
              value={formData.sectionId}
              disabled
              className={
                errors.sectionId
                  ? disabledSelectErrorClass
                  : disabledSelectClass
              }
            >
              <option value="">Section Module coming soon</option>
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

          <FormField label="Guardian Phone" error={errors.guardianPhone}>
            <input
              type="text"
              value={formData.guardianPhone}
              onChange={handleChange("guardianPhone")}
              className={errors.guardianPhone ? inputErrorClass : inputClass}
            />
          </FormField>
        </SectionCard>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/students")}
            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors"
          >
            Create Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentAddPage;
