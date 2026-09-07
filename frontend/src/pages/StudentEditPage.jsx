import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, User, GraduationCap, Users } from "lucide-react";
import {
  useStudent,
  useUpdateStudent,
} from "../features/students/student.hooks";

// Reusable section shell
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

// Reusable label + input + error wrapper
const FormField = ({ label, error, children }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
  </div>
);

const inputClass = (hasError) =>
  `w-full px-3 py-2 border ${
    hasError
      ? "border-red-500 focus:ring-red-500"
      : "border-slate-200 focus:ring-blue-500"
  } rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors`;

const StudentEditPage = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const updateStudentMutation = useUpdateStudent();
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

  // Track initial state to disable save button if unchanged
  const [initialFormData, setInitialFormData] = useState(null);
  const [errors, setErrors] = useState({});
  // 1. Server error state
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (!student) return;

    const initialData = {
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
    };

    setFormData(initialData);
    setInitialFormData(initialData);
  }, [student]);

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
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
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }

    if (formData.guardianPhone && !/^[0-9]{10}$/.test(formData.guardianPhone)) {
      newErrors.guardianPhone = "Phone number must be exactly 10 digits";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. Submit अघि clear गर्ने
    setSubmitError("");

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const updatedStudent = await updateStudentMutation.mutateAsync({
        studentId,
        data: {
          name: formData.name.trim(),
          admissionNumber: formData.admissionNumber.trim(),
          dateOfBirth: formData.dateOfBirth || null,
          gender: formData.gender || null,
          phone: formData.phone || null,
          address: formData.address.trim(),
          classId: formData.classId,
          sectionId: formData.sectionId,
          guardian: {
            name: formData.guardianName.trim() || null,
            relationship: formData.guardianRelationship.trim() || null,
            phone: formData.guardianPhone || null,
          },
        },
      });

      navigate(`/students/${updatedStudent._id}`);
    } catch (err) {
      // 3. catch replace
      setSubmitError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update student",
      );
    }
  };

  // Form मा केही परिवर्तन भएको छ कि छैन चेक गर्ने
  const isFormUnchanged =
    JSON.stringify(formData) === JSON.stringify(initialFormData);

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

      {/* 4. Form माथि error banner */}
      {submitError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm font-medium text-red-700">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Personal Information */}
        <SectionCard icon={User} title="Personal Information">
          <FormField label="Student Name" error={errors.name}>
            <input
              type="text"
              value={formData.name}
              onChange={handleChange("name")}
              className={inputClass(errors.name)}
            />
          </FormField>

          <FormField label="Admission Number" error={errors.admissionNumber}>
            <input
              type="text"
              value={formData.admissionNumber}
              onChange={handleChange("admissionNumber")}
              className={inputClass(errors.admissionNumber)}
            />
          </FormField>

          <FormField label="Date of Birth" error={errors.dateOfBirth}>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange("dateOfBirth")}
              className={inputClass(errors.dateOfBirth)}
            />
          </FormField>

          <FormField label="Gender" error={errors.gender}>
            <select
              value={formData.gender}
              onChange={handleChange("gender")}
              className={inputClass(errors.gender)}
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
              className={inputClass(errors.phone)}
            />
          </FormField>

          <FormField label="Address" error={errors.address}>
            <input
              type="text"
              value={formData.address}
              onChange={handleChange("address")}
              className={inputClass(errors.address)}
            />
          </FormField>
        </SectionCard>

        {/* Academic Information */}
        <SectionCard icon={GraduationCap} title="Academic Information">
          <FormField label="Class" error={errors.classId}>
            <select
              value={formData.classId}
              onChange={handleChange("classId")}
              className={inputClass(errors.classId)}
            >
              <option value="">Select Class</option>
            </select>
          </FormField>

          <FormField label="Section" error={errors.sectionId}>
            <select
              value={formData.sectionId}
              onChange={handleChange("sectionId")}
              className={inputClass(errors.sectionId)}
            >
              <option value="">Select Section</option>
            </select>
          </FormField>
        </SectionCard>

        {/* Guardian Information */}
        <SectionCard icon={Users} title="Guardian Information">
          <FormField label="Guardian Name" error={errors.guardianName}>
            <input
              type="text"
              value={formData.guardianName}
              onChange={handleChange("guardianName")}
              className={inputClass(errors.guardianName)}
            />
          </FormField>

          <FormField label="Relationship" error={errors.guardianRelationship}>
            <input
              type="text"
              value={formData.guardianRelationship}
              onChange={handleChange("guardianRelationship")}
              className={inputClass(errors.guardianRelationship)}
            />
          </FormField>

          <FormField label="Guardian Phone" error={errors.guardianPhone}>
            <input
              type="text"
              value={formData.guardianPhone}
              onChange={handleChange("guardianPhone")}
              className={inputClass(errors.guardianPhone)}
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

          {/* 5. Save button logic */}
          <button
            type="submit"
            disabled={updateStudentMutation.isPending || isFormUnchanged}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          >
            {updateStudentMutation.isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentEditPage;
