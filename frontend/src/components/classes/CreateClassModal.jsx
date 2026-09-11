import { X } from "lucide-react";
import ClassCreatePage from "./ClassCreatePage";

const CreateClassModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create class"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close create class modal"
          className="absolute right-3 top-3 z-10 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
        <ClassCreatePage embedded onCancel={onClose} onCreated={onClose} />
      </div>
    </div>
  );
};

export default CreateClassModal;
