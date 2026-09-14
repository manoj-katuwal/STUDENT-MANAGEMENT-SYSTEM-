import { AlertTriangle, X } from "lucide-react";

const StudentFeeCancelModal = ({ studentFee, onClose, onConfirm }) => {
  if (!studentFee) {
    return null;
  }

  const studentName = studentFee.studentId?.name ?? "—";
  const dueAmount = studentFee.dueAmount ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Cancel Student Fee
              </h2>

              <p className="mt-0.5 text-xs text-gray-500">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50/70 p-4 space-y-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-medium">Student</span>

            <span className="font-semibold text-gray-900">{studentName}</span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-gray-500 font-medium">Outstanding Due</span>

            <span className="font-bold text-red-600">
              NPR {dueAmount.toLocaleString()}
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-gray-600">
          Are you sure you want to cancel this student fee? The fee will no
          longer be considered active in the student fee ledger.
        </p>

        <div className="mt-6 flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            Keep Fee
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-700 active:bg-red-800 transition-colors shadow-sm"
          >
            Confirm Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentFeeCancelModal;
