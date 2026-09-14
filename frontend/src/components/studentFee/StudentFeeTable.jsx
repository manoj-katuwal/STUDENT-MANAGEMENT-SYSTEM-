import React from "react";
import {
  MoreVertical,
  Receipt,
  Eye,
  CreditCard,
  FileSpreadsheet,
} from "lucide-react";

// Dummy data to demonstrate production table layout
const dummyFeeRecords = [
  {
    id: "1",
    studentName: "Aarav Sharma",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    admissionNo: "ADM-2081-001",
    academicYear: "2081/82",
    feeType: "Tuition & Annual Fee",
    totalAmount: 45000,
    discountAmount: 5000,
    netAmount: 40000,
    paidAmount: 40000,
    dueAmount: 0,
    status: "PAID",
  },
  {
    id: "2",
    studentName: "Siddharth Thapa",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    admissionNo: "ADM-2081-042",
    academicYear: "2081/82",
    feeType: "Semester Fee",
    totalAmount: 55000,
    discountAmount: 0,
    netAmount: 55000,
    paidAmount: 25000,
    dueAmount: 30000,
    status: "PARTIAL",
  },
  {
    id: "3",
    studentName: "Pooja Adhikari",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    admissionNo: "ADM-2081-089",
    academicYear: "2081/82",
    feeType: "Exam & Lab Fee",
    totalAmount: 18000,
    discountAmount: 2000,
    netAmount: 16000,
    paidAmount: 0,
    dueAmount: 16000,
    status: "PENDING",
  },
];

const StudentFeeTable = () => {
  const records = dummyFeeRecords; // Switch to [] to test the empty state

  const getStatusBadge = (status) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            Paid
          </span>
        );
      case "PARTIAL":
        return (
          <span className="inline-flex items-center rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
            Partial
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
            Pending
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-500/10">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-slate-600">
          {/* Table Header */}
          <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                Student
              </th>
              <th scope="col" className="px-4 py-3.5">
                Admission No.
              </th>
              <th scope="col" className="px-4 py-3.5">
                Academic Year
              </th>
              <th scope="col" className="px-4 py-3.5">
                Fee Type
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Total
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Discount
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Net
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Paid
              </th>
              <th scope="col" className="px-4 py-3.5 text-right">
                Due
              </th>
              <th scope="col" className="px-4 py-3.5 text-center">
                Status
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 bg-white">
            {records.length > 0 ? (
              records.map((row) => (
                <tr
                  key={row.id}
                  className="transition-colors hover:bg-slate-50/60"
                >
                  {/* Student Info */}
                  <td className="px-5 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={row.avatar}
                        alt={row.studentName}
                        className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <div>
                        <span className="font-semibold text-slate-900 block">
                          {row.studentName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Admission No */}
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-700 font-mono text-xs">
                    {row.admissionNo}
                  </td>

                  {/* Academic Year */}
                  <td className="px-4 py-4 whitespace-nowrap text-slate-600">
                    {row.academicYear}
                  </td>

                  {/* Fee Type */}
                  <td className="px-4 py-4 whitespace-nowrap font-medium text-slate-800">
                    {row.feeType}
                  </td>

                  {/* Total */}
                  <td className="px-4 py-4 text-right whitespace-nowrap font-medium text-slate-600">
                    NPR {row.totalAmount.toLocaleString()}
                  </td>

                  {/* Discount */}
                  <td className="px-4 py-4 text-right whitespace-nowrap text-slate-500">
                    {row.discountAmount > 0
                      ? `NPR ${row.discountAmount.toLocaleString()}`
                      : "-"}
                  </td>

                  {/* Net */}
                  <td className="px-4 py-4 text-right whitespace-nowrap font-semibold text-slate-900">
                    NPR {row.netAmount.toLocaleString()}
                  </td>

                  {/* Paid */}
                  <td className="px-4 py-4 text-right whitespace-nowrap font-semibold text-emerald-600">
                    NPR {row.paidAmount.toLocaleString()}
                  </td>

                  {/* Due */}
                  <td className="px-4 py-4 text-right whitespace-nowrap font-semibold text-rose-600">
                    {row.dueAmount > 0
                      ? `NPR ${row.dueAmount.toLocaleString()}`
                      : "NPR 0"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-4 text-center whitespace-nowrap">
                    {getStatusBadge(row.status)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        title="View Ledger"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        title="Collect Payment"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4" />
                      </button>
                      <button
                        title="More Options"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              /* Empty State */
              <tr>
                <td colSpan={11} className="px-4 py-14 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                      <FileSpreadsheet className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-slate-800">
                        No student fee records found
                      </p>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        There are no assigned fees matching your search or
                        filter criteria.
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentFeeTable;
