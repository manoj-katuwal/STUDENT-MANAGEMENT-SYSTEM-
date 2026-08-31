import { formatCurrency } from "../../utils/formatCurrency";

function PaymentMethods({ paymentMethods = [] }) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>

        <p className="text-sm text-gray-500">Collection by payment method</p>
      </div>

      <div className="space-y-5">
        {paymentMethods.length > 0 ? (
          paymentMethods.map((item) => (
            <div key={item.paymentMethod}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {item.paymentMethod}
                </span>

                <span className="text-sm font-semibold text-gray-900">
                  {formatCurrency(item.totalCollection)}
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No payment data available.</p>
        )}
      </div>
    </div>
  );
}

export default PaymentMethods;
