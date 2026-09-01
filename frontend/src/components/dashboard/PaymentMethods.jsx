import { Banknote, Landmark, FileText, CreditCard, Wallet } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";

const PaymentMethods = ({ paymentMethods = [] }) => {
  // Compute total for percentage calculation
  const total = paymentMethods.reduce(
    (sum, item) => sum + (item.totalCollection || 0),
    0,
  );

  // Map payment method names to icons and colours (matching backend enums & formatted strings)
  const methodMeta = {
    CASH: {
      label: "Cash",
      icon: Banknote,
      color: "bg-emerald-500",
      bg: "bg-emerald-50 text-emerald-600",
    },
    BANK_TRANSFER: {
      label: "Bank Transfer",
      icon: Landmark,
      color: "bg-blue-500",
      bg: "bg-blue-50 text-blue-600",
    },
    CHEQUE: {
      label: "Cheque",
      icon: FileText,
      color: "bg-amber-500",
      bg: "bg-amber-50 text-amber-600",
    },
    ESEWA: {
      label: "eSewa",
      icon: Wallet,
      color: "bg-green-500",
      bg: "bg-green-50 text-green-600",
    },
    KHALTI: {
      label: "Khalti",
      icon: CreditCard,
      color: "bg-purple-500",
      bg: "bg-purple-50 text-purple-600",
    },
    // Fallbacks
    Cash: {
      label: "Cash",
      icon: Banknote,
      color: "bg-emerald-500",
      bg: "bg-emerald-50 text-emerald-600",
    },
    "Bank Transfer": {
      label: "Bank Transfer",
      icon: Landmark,
      color: "bg-blue-500",
      bg: "bg-blue-50 text-blue-600",
    },
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-xs">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold font-poppins text-slate-900">
            Payment Methods
          </h2>
          <p className="text-xs text-slate-500">Collection by payment method</p>
        </div>
        {total > 0 && (
          <div className="text-right">
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
              Total
            </span>
            <p className="text-base font-bold font-poppins text-slate-900">
              {formatCurrency(total)}
            </p>
          </div>
        )}
      </div>

      {/* List */}
      {paymentMethods.length > 0 ? (
        <ul className="space-y-4" role="list">
          {paymentMethods.map((item) => {
            const rawMethod = item.paymentMethod || "UNKNOWN";
            const meta = methodMeta[rawMethod] || {
              label: rawMethod,
              icon: Wallet,
              color: "bg-slate-500",
              bg: "bg-slate-50 text-slate-600",
            };
            const Icon = meta.icon;
            const percentage =
              total > 0 ? (item.totalCollection / total) * 100 : 0;

            return (
              <li key={rawMethod} className="group">
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${meta.bg}`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="text-sm font-medium text-slate-700">
                      {meta.label}
                    </span>
                  </div>
                  <span className="text-sm font-semibold font-poppins text-slate-900">
                    {formatCurrency(item.totalCollection)}
                  </span>
                </div>
                <div className="relative h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${meta.color}`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                    role="progressbar"
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
                <span className="mt-1 block text-[11px] text-slate-400">
                  {percentage.toFixed(1)}% of total collection
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-10 text-center bg-slate-50/50">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
            <Wallet className="h-6 w-6" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-slate-700">
            No payment data available
          </p>
          <p className="text-xs text-slate-400 max-w-xs mt-1">
            Collections grouped by payment methods (Cash, eSewa, Bank Transfer)
            will appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
