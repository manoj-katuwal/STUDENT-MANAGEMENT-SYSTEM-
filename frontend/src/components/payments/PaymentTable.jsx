import {
  Eye,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  Wallet,
  Receipt,
  User,
  Inbox,
  AlertCircle,
} from "lucide-react";

const PaymentTable = ({ payment = [], isLoading, isError, onView  }) => {
  // Status badge र Icon dynamic बनाउने
  const renderStatus = (status = "") => {
    switch (status.toLowerCase()) {
      case "success":
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Success
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
            <Clock className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
            Pending
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
            <XCircle className="h-3.5 w-3.5 text-rose-600" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-700 ring-1 ring-inset ring-slate-600/20">
            {status || "Unknown"}
          </span>
        );
    }
  };

  // Payment Method Badge Design
  const renderMethod = (method = "") => {
    const formattedMethod = method.toLowerCase();

    if (formattedMethod.includes("esewa")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100/70 px-2 py-0.5 text-xs font-bold text-emerald-800">
          eSewa
        </span>
      );
    }
    if (formattedMethod.includes("khalti")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-purple-100/70 px-2 py-0.5 text-xs font-bold text-purple-800">
          Khalti
        </span>
      );
    }
    if (formattedMethod.includes("cash")) {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
          <Wallet className="h-3 w-3 text-slate-500" />
          Cash
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
        <CreditCard className="h-3 w-3 text-blue-500" />
        {method || "Online"}
      </span>
    );
  };

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-180 border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th scope="col" className="px-6 py-4">
                Transaction ID
              </th>
              <th scope="col" className="px-6 py-4">
                Student Details
              </th>
              <th scope="col" className="px-6 py-4">
                Amount
              </th>
              <th scope="col" className="px-6 py-4">
                Method
              </th>
              <th scope="col" className="px-6 py-4">
                Status
              </th>
              <th scope="col" className="px-6 py-4">
                Date
              </th>
              <th scope="col" className="px-6 py-4 text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {/* 1. Loading State (Skeleton Rows) */}
            {isLoading ? (
              [...Array(5)].map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-6 py-4">
                    <div className="h-4 w-28 rounded bg-slate-200" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-slate-200 shrink-0" />
                      <div className="space-y-1.5">
                        <div className="h-3.5 w-32 rounded bg-slate-200" />
                        <div className="h-2.5 w-20 rounded bg-slate-200" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-16 rounded bg-slate-200" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 w-14 rounded-md bg-slate-200" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-6 w-20 rounded-full bg-slate-200" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-3.5 w-24 rounded bg-slate-200" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="h-7 w-7 rounded-lg bg-slate-200" />
                      <div className="h-7 w-7 rounded-lg bg-slate-200" />
                    </div>
                  </td>
                </tr>
              ))
            ) : isError ? (
              /* 2. Error State */
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-rose-500"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-8 w-8 text-rose-500" />
                    <p className="text-sm font-semibold">
                      डाटा लोड गर्दा समस्या आयो। कृपया पुन: प्रयास गर्नुहोस्।
                    </p>
                  </div>
                </td>
              </tr>
            ) : payment.length === 0 ? (
              /* 3. Empty State */
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-slate-400"
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Inbox className="h-8 w-8 text-slate-300" />
                    <p className="text-sm font-medium">
                      कुनै भुक्तानी रेकर्ड भेटिएन
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              /* 4. Data Rows */
              payment.map((item) => {
                const studentName = item.studentFeeId?.studentId?.name || "N/A";
                const admissionNo =
                  item.studentFeeId?.studentId?.admissionNumber || "N/A";
                const transactionId = item.transactionId || item._id;

                return (
                  <tr
                    key={transactionId}
                    className="group transition-colors duration-150 hover:bg-slate-50/80"
                  >
                    {/* Transaction ID */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                        <span className="font-mono text-xs font-semibold text-slate-700">
                          {transactionId}
                        </span>
                      </div>
                    </td>

                    {/* Student Info with Avatar */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          {studentName !== "N/A" ? (
                            studentName.charAt(0)
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {studentName}
                          </p>
                          <p className="text-xs font-medium text-slate-400">
                            {admissionNo}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="font-bold text-slate-900">
                        Rs. {Number(item.amount).toLocaleString()}
                      </span>
                    </td>

                    {/* Method */}
                    <td className="whitespace-nowrap px-6 py-4">
                      {renderMethod(item.paymentMethod)}
                    </td>

                    {/* Status */}
                    <td className="whitespace-nowrap px-6 py-4">
                      {renderStatus(item.paymentStatus)}
                    </td>

                    {/* Date */}
                    <td className="whitespace-nowrap px-6 py-4 text-xs font-medium text-slate-500">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          title="View Details"
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-all cursor-pointer"
                          onClick={() => onView?.(item._id)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          title="Download Receipt"
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-emerald-600 transition-all cursor-pointer"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PaymentTable;
