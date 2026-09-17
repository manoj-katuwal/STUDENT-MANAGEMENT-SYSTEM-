import { useState } from "react";
import PaymentHeader from "../components/payments/PaymentHeader";
import PaymentContextBar from "../components/payments/PaymentContextBar";
import PaymentStats from "../components/payments/PaymentStats";
import PaymentFilters from "../components/payments/PaymentFilters";
import PaymentTable from "../components/payments/PaymentTable";
import { usePayments } from "../features/payments/payment.hooks";
// import PaymentDetailsDrawer from "../components/payments/PaymentDetailsDrawer";

const PaymentsPage = () => {
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const { data, isLoading, isError } = usePayments({
    page: 1,
    limit: 10,
    search,
    paymentMethod,
    paymentStatus,
    paymentType,
  });

  console.log("Payments:", data);
  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <PaymentContextBar />
      <PaymentHeader />
      <PaymentStats />
      <PaymentFilters
        search={search}
        onSearchChange={setSearch}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={setPaymentStatus}
        paymentType={paymentType}
        onPaymentTypeChange={setPaymentType}
      />
      <PaymentTable
        payment={data?.payments ?? []}
        isLoading={isLoading}
        isError={isError}
      />
      {/* <PaymentDetailsDrawer /> */}
    </div>
  );
};

export default PaymentsPage;
