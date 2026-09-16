import { Eye, Download, MoreVertical } from "lucide-react";

const PaymentTable = () => {
  const payments = [
    {
      id: "PAY-001",
      student: "Soma Katwal",
      admissionNo: "INT-TEST-002",
      amount: "Rs. 15,000",
      method: "Cash",
      status: "Success",
      date: "Sep 16, 2026",
    },
    {
      id: "PAY-002",
      student: "Aarav Sharma",
      admissionNo: "INT-TEST-003",
      amount: "Rs. 12,500",
      method: "eSewa",
      status: "Success",
      date: "Sep 15, 2026",
    },
    {
      id: "PAY-003",
      student: "Pooja Thapa",
      admissionNo: "INT-TEST-004",
      amount: "Rs. 8,000",
      method: "Khalti",
      status: "Pending",
      date: "Sep 14, 2026",
    },
  ];

  // Status अनुसार dynamic styling
  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "success":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      case "pending":
        return "bg-amber-50 text-amber-700 ring-amber-600/20";
      case "failed":
        return "bg-rose-50 text-rose-700 ring-rose-600/20";
      default:
        return "bg-slate-50 text-slate-700 ring-slate-600/20";
    }
  };

  return (
    <div className="w-full overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-212.5 border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th scope="col" className="px-6 py-3.5">
                Transaction ID
              </th>
              <th scope="col" className="px-6 py-3.5">
                Student Details
              </th>
              <th scope="col" className="px-6 py-3.5">
                Amount
              </th>
              <th scope="col" className="px-6 py-3.5">
                Method
              </th>
              <th scope="col" className="px-6 py-3.5">
                Status
              </th>
              <th scope="col" className="px-6 py-3.5">
                Date
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="transition-colors duration-150 hover:bg-slate-50/60"
              >
                {/* ID */}
                <td className="whitespace-nowrap px-6 py-4 font-mono text-xs font-medium text-slate-600">
                  {payment.id}
                </td>

                {/* Student */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="font-medium text-slate-900">
                    {payment.student}
                  </div>
                  <div className="text-xs text-slate-400">
                    {payment.admissionNo}
                  </div>
                </td>

                {/* Amount */}
                <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                  {payment.amount}
                </td>

                {/* Method */}
                <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    {payment.method}
                  </span>
                </td>

                {/* Status */}
                <td className="whitespace-nowrap px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-x-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadge(
                      payment.status,
                    )}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {payment.status}
                  </span>
                </td>

                {/* Date */}
                <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                  {payment.date}
                </td>

                {/* Actions */}
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      title="View Details"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      title="Download Receipt"
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;
