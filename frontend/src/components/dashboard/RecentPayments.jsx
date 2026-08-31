function RecentPayments({ payments = [] }) {
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Recent Payments</h2>

        <p className="text-sm text-gray-500">Latest successful payments</p>
      </div>

      {payments.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm text-gray-500">No recent payments found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Method</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id} className="border-b last:border-0">
                  <td className="py-4 text-sm text-gray-700">
                    {payment.studentFeeId?.studentId || "-"}
                  </td>

                  <td className="py-4 text-sm text-gray-700">
                    {payment.paymentMethod || "-"}
                  </td>

                  <td className="py-4 text-sm font-medium text-gray-900">
                    Rs. {payment.amount}
                  </td>

                  <td className="py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      {payment.paymentStatus}
                    </span>
                  </td>

                  <td className="py-4 text-sm text-gray-500">
                    {formatDate(payment.paidAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default RecentPayments;
