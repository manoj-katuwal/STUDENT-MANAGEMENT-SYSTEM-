import { X } from "lucide-react";
import SectionCreatePage from "./SectionCreatePage";

const CreateSectionModal = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Create section"
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close create section modal"
          className="absolute right-5 top-5 z-10 rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <X className="h-5 w-5" />
        </button>
        <SectionCreatePage embedded onCancel={onClose} onCreated={onClose} />
      </div>
    </div>
  );
};

export default CreateSectionModal;
