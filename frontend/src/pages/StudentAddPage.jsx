import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  GraduationCap,
  Users,
  LockKeyhole,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";
import { useCreateStudent } from "../features/students/student.hooks";
import { useClasses } from "../features/classes/class.hooks";
import { useSections } from "../features/sections/section.hook";

const SectionCard = ({ icon: Icon, title, description, children }) => (
  <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
    <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100">
      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
      {children}
    </div>
  </div>
);

const FormField = ({ label, required = false, children, error, hint }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
    </div>
    {children}
    {error && (
      <p className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1">
        <span>•</span> {error}
      </p>
    )}
  </div>
);

const inputClass =
  "w-full px-3.5 py-2.5 bg-slate-50/50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-150";

const inputErrorClass =
  "w-full px-3.5 py-2.5 bg-red-50/30 border border-red-300 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all duration-150";

const StudentAddPage = ({ onCreated, onCancel, embedded = false }) => {
  const navigate = useNavigate();
  const createStudentMutation = useCreateStudent();
  const [showPassword, setShowPassword] = useState(false);

  const { data: classesData, isLoading: classesLoading } = useClasses({
    page: 1,
    limit: 100,
    status: "ACTIVE",
  });

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
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const { data: sectionsData, isLoading: sectionsLoading } = useSections({
    page: 1,
    limit: 100,
    classId: formData.classId,
  });

  const activeClasses = classesData?.classes ?? [];
  const activeSections = (sectionsData?.sections ?? []).filter(
    (section) => section.status === "ACTIVE",
  );

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const handleClassChange = (e) => {
    const classId = e.target.value;

    setFormData((prev) => ({
      ...prev,
      classId,
      sectionId: "",
    }));
    setErrors((prev) => ({
      ...prev,
      classId: null,
      sectionId: null,
    }));
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
      newErrors.classId = "Class selection is required";
    }

    if (!formData.sectionId) {
      newErrors.sectionId = "Section selection is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
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
      email: formData.email.trim(),
      password: formData.password,
      guardian: {
        name: formData.guardianName.trim() || null,
        relationship: formData.guardianRelationship.trim() || null,
        phone: formData.guardianPhone || null,
      },
    };

    try {
      const student = await createStudentMutation.mutateAsync(payload);
      if (onCreated) {
        onCreated(student);
      } else {
        navigate(`/students/${student._id}`);
      }
    } catch (error) {
      setSubmitError(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to create student",
      );
    }
  };

  return (
    <div
      className={
        embedded ? "space-y-6" : "max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6"
      }
    >
      {/* Header */}
      {!embedded && (
        <div className="flex items-center justify-between bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => (onCancel ? onCancel() : navigate("/students"))}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                Add New Student
              </h1>
              <p className="text-xs text-slate-500">
                Register a new student and set up their portal account
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {submitError && (
        <div className="bg-red-50/80 border border-red-200/80 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          {submitError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <SectionCard
          icon={User}
          title="Personal Details"
          description="Basic identifying information about the student"
        >
          <FormField label="Full Name" required error={errors.name}>
            <input
              type="text"
              placeholder="e.g. John Doe"
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
              placeholder="e.g. ADM-2024-001"
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
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </FormField>

          <FormField
            label="Personal Phone"
            error={errors.phone}
            hint="Optional"
          >
            <input
              type="text"
              placeholder="10 digit phone number"
              value={formData.phone}
              onChange={handleChange("phone")}
              className={errors.phone ? inputErrorClass : inputClass}
            />
          </FormField>

          <FormField label="Home Address">
            <input
              type="text"
              placeholder="Full physical address"
              value={formData.address}
              onChange={handleChange("address")}
              className={inputClass}
            />
          </FormField>
        </SectionCard>

        {/* Academic Information */}
        <SectionCard
          icon={GraduationCap}
          title="Academic Placement"
          description="Class and section assignment"
        >
          <FormField label="Class" required error={errors.classId}>
            <select
              value={formData.classId}
              onChange={handleClassChange}
              disabled={classesLoading}
              className={errors.classId ? inputErrorClass : inputClass}
            >
              <option value="">
                {classesLoading ? "Loading classes..." : "Select a class"}
              </option>
              {activeClasses.map((classRecord) => (
                <option key={classRecord._id} value={classRecord._id}>
                  {classRecord.name} ({classRecord.code})
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Section" required error={errors.sectionId}>
            <select
              value={formData.sectionId}
              onChange={handleChange("sectionId")}
              disabled={!formData.classId || sectionsLoading}
              className={errors.sectionId ? inputErrorClass : inputClass}
            >
              <option value="">
                {!formData.classId
                  ? "Select a class first"
                  : sectionsLoading
                    ? "Loading sections..."
                    : "Select a section"}
              </option>
              {activeSections.map((section) => (
                <option key={section._id} value={section._id}>
                  {section.name}
                </option>
              ))}
            </select>
          </FormField>
        </SectionCard>

        {/* Guardian Information */}
        <SectionCard
          icon={Users}
          title="Guardian Contact"
          description="Primary parent or guardian contact details"
        >
          <FormField label="Guardian Name">
            <input
              type="text"
              placeholder="Parent or Guardian name"
              value={formData.guardianName}
              onChange={handleChange("guardianName")}
              className={inputClass}
            />
          </FormField>

          <FormField label="Relationship">
            <input
              type="text"
              placeholder="e.g. Father, Mother, Uncle"
              value={formData.guardianRelationship}
              onChange={handleChange("guardianRelationship")}
              className={inputClass}
            />
          </FormField>

          <FormField label="Guardian Phone" error={errors.guardianPhone}>
            <input
              type="text"
              placeholder="10 digit contact number"
              value={formData.guardianPhone}
              onChange={handleChange("guardianPhone")}
              className={errors.guardianPhone ? inputErrorClass : inputClass}
            />
          </FormField>
        </SectionCard>

        {/* Login Account */}
        <SectionCard
          icon={LockKeyhole}
          title="Student Credentials"
          description="Credentials for student portal login access"
        >
          <FormField label="Email Address" required error={errors.email}>
            <input
              type="email"
              placeholder="student@example.com"
              value={formData.email}
              onChange={handleChange("email")}
              className={errors.email ? inputErrorClass : inputClass}
            />
          </FormField>

          <FormField
            label="Password"
            required
            error={errors.password}
            hint="Min. 8 characters"
          >
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter strong password"
                value={formData.password}
                onChange={handleChange("password")}
                className={`${
                  errors.password ? inputErrorClass : inputClass
                } pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </FormField>
        </SectionCard>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200/60">
          <button
            type="button"
            onClick={() => (onCancel ? onCancel() : navigate("/students"))}
            disabled={createStudentMutation.isPending}
            className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl shadow-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createStudentMutation.isPending}
            className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createStudentMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Student...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Create Student</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentAddPage;
