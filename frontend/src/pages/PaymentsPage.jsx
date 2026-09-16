import React from "react";
import PaymentHeader from "../components/payments/PaymentHeader";
import PaymentContextBar from "../components/payments/PaymentContextBar";
import PaymentStats from "../components/payments/PaymentStats";
import PaymentFilters from "../components/payments/PaymentFilters";
import PaymentTable from "../components/payments/PaymentTable";
import PaymentDetailsDrawer from "../components/payments/PaymentDetailsDrawer";

const PaymentsPage = () => {
  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <PaymentContextBar />
      <PaymentHeader />
      <PaymentStats />
      <PaymentFilters />
      <PaymentTable />
      <PaymentDetailsDrawer />
    </div>
  );
};

export default PaymentsPage;
