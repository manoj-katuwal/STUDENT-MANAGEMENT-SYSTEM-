import React from "react";
import PaymentHeader from "../components/payments/PaymentHeader";
import PaymentContextBar from "../components/payments/PaymentContextBar";

const PaymentsPage = () => {
  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <PaymentContextBar />

      <PaymentHeader />
    </div>
  );
};

export default PaymentsPage;
