import { useEffect, useState } from "react";
import { X } from "lucide-react";

const StudentFeeEditModal = ({ studentFee, onClose, onSubmit }) => {
  const [discountAmount, setDiscountAmount] = useState("");

  useEffect(() => {
    if (studentFee) {
      setDiscountAmount(studentFee.discountAmount ?? 0);
    }
  }, [studentFee]);

  if (!studentFee) return null;

  const totalAmount = studentFee.totalAmount ?? 0;
  const currentDiscount = studentFee.discountAmount ?? 0;
  const numericDiscount = Math.min(
    Math.max(0, Number(discountAmount) || 0),
    totalAmount,
  );
  const finalPayable = Math.max(0, totalAmount - numericDiscount);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ discountAmount: numericDiscount });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Edit Discount</h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Adjust fee discount for this student record.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Student Info Box */}
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-3.5 border border-gray-100">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block">
                Student
              </span>
              <p className="text-sm font-semibold text-gray-800 mt-0.5">
                {studentFee.studentId?.name ?? "—"}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block">
                Original Fee
              </span>
              <p className="text-sm font-bold text-gray-900 mt-0.5">
                NPR {totalAmount.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Input Field */}
          <div>
            <label
              htmlFor="discountAmount"
              className="block text-xs font-semibold text-gray-700 mb-1.5"
            >
              Discount Amount (NPR)
            </label>
            <input
              id="discountAmount"
              type="number"
              min="0"
              max={totalAmount}
              value={discountAmount}
              onChange={(e) => setDiscountAmount(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm font-medium text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-gray-400"
              placeholder="0"
            />
          </div>

          {/* Breakdown Card */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-2.5 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Current Discount</span>
              <span className="font-semibold text-gray-700">
                NPR {currentDiscount.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>New Discount</span>
              <span className="font-semibold text-emerald-600">
                + NPR {numericDiscount.toLocaleString()}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2.5 mt-2.5 flex justify-between text-sm font-bold text-gray-900">
              <span>Final Payable Amount</span>
              <span className="text-blue-600">
                NPR {finalPayable.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentFeeEditModal;
