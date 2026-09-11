import { X } from "lucide-react";
import StudentAddPage from "../../pages/StudentAddPage";

const CreateStudentModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create student"
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-xl bg-slate-50 p-5"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close create student modal"
          className="sticky float-right right-0 top-0 z-10 rounded-lg bg-white p-2 text-slate-400 shadow-sm transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mb-4 pr-10">
          <h2 className="text-xl font-bold text-slate-900">Add Student</h2>
          <p className="text-sm text-slate-500">Create a student profile and assign an academic section.</p>
        </div>
        <StudentAddPage embedded onCancel={onClose} onCreated={onClose} />
      </div>
    </div>
  );
};

export default CreateStudentModal;
