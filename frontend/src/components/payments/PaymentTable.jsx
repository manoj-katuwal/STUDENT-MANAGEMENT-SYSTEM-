import {
  Eye,
  MoreVertical,
  ArrowUpDown,
  CreditCard,
  Building2,
  Smartphone,
  CheckCircle2,
  Clock,
  RotateCcw,
} from "lucide-react";

const PaymentTable = () => {
  const payments = [
    {
      id: "TXN-89401",
      student: "Soma Katwal",
      admissionNo: "INT-TEST-002",
      feeReference: "Tuition Fee - Term 1",
      amount: "NPR 15,000",
      method: "Cash",
      type: "Fee Payment",
      status: "Success",
      paidAt: "Sep 16, 2026 • 10:42 AM",
    },
    {
      id: "TXN-89400",
      student: "Aarav Sharma",
      admissionNo: "INT-TEST-003",
      feeReference: "Admission & Uniform",
      amount: "NPR 12,500",
      method: "eSewa",
      type: "Admission",
      status: "Success",
      paidAt: "Sep 15, 2026 • 02:15 PM",
    },
    {
      id: "TXN-89399",
      student: "Pooja Thapa",
      admissionNo: "INT-TEST-008",
      feeReference: "Exam Fee",
      amount: "NPR 3,500",
      method: "Bank Transfer",
      type: "Exam",
      status: "Pending",
      paidAt: "Sep 15, 2026 • 11:30 AM",
    },
    {
      id: "TXN-89398",
      student: "Rohan Rai",
      admissionNo: "INT-TEST-012",
      feeReference: "Monthly Transport",
      amount: "NPR 4,000",
      method: "Khalti",
      type: "Transport",
      status: "Reversed",
      paidAt: "Sep 14, 2026 • 04:05 PM",
    },
  ];

  const getMethodIcon = (method) => {
    switch (method) {
      case "eSewa":
      case "Khalti":
        return <Smartphone className="h-3.5 w-3.5 text-purple-600" />;
      case "Bank Transfer":
      case "Cheque":
        return <Building2 className="h-3.5 w-3.5 text-blue-600" />;
      default:
        return <CreditCard className="h-3.5 w-3.5 text-emerald-600" />;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Success":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/60">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
            Success
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200/60">
            <Clock className="h-3 w-3 text-amber-600" />
            Pending
          </span>
        );
      case "Reversed":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200">
            <RotateCcw className="h-3 w-3 text-slate-500" />
            Reversed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] border-collapse text-left text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500 select-none">
              <th className="px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  Student
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>
              <th className="px-5 py-3.5">Fee Reference</th>
              <th className="px-5 py-3.5">
                <div className="flex items-center gap-1.5">
                  Amount
                  <ArrowUpDown className="h-3 w-3 text-slate-400" />
                </div>
              </th>
              <th className="px-5 py-3.5">Method</th>
              <th className="px-5 py-3.5">Type</th>
              <th className="px-5 py-3.5">Status</th>
              <th className="px-5 py-3.5">Transaction ID & Paid At</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {payments.map((payment) => (
              <tr
                key={payment.id}
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600 border border-blue-100">
                      {payment.student.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {payment.student}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400">
                        {payment.admissionNo}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 font-medium text-slate-700">
                  {payment.feeReference}
                </td>
                <td className="px-5 py-3.5 font-bold text-slate-900">
                  {payment.amount}
                </td>
                <td className="px-5 py-3.5">
                  <div className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100/70 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {getMethodIcon(payment.method)}
                    <span>{payment.method}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="text-xs font-medium text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                    {payment.type}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {getStatusBadge(payment.status)}
                </td>
                <td className="px-5 py-3.5">
                  <p className="font-mono text-xs font-semibold text-slate-800">
                    {payment.id}
                  </p>
                  <p className="text-[11px] text-slate-400">{payment.paidAt}</p>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400"
                    >
                      <MoreVertical className="h-4 w-4" />
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
