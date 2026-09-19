import { useState } from "react";
import PaymentHeader from "../components/payments/PaymentHeader";
import PaymentContextBar from "../components/payments/PaymentContextBar";
import PaymentStats from "../components/payments/PaymentStats";
import PaymentFilters from "../components/payments/PaymentFilters";
import PaymentTable from "../components/payments/PaymentTable";
import { usePayments } from "../features/payments/payment.hooks";
import PaymentDetailsDrawer from "../components/payments/PaymentDetailsDrawer";
import useDebounce from "../hooks/useDebounce";
import PaymentPagination from "../components/payments/PaymentPagination";
import RecordPaymentDrawer from "../components/payments/RecordPaymentDrawer";

const PaymentsPage = () => {
  const [search, setSearch] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [page, setPage] = useState(1);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 700);
  const { data, isLoading, isError } = usePayments({
    page,
    limit: 10,
    search: debouncedSearch,
    paymentMethod,
    paymentStatus,
    paymentType,
  });

  const handleSearchChange = (value) => {
    setSearch(value);
    setPage(1);
  };

  const handlePaymentMethodChange = (value) => {
    setPaymentMethod(value);
    setPage(1);
  };
  const handlePaymentStatusChange = (value) => {
    setPaymentStatus(value);
    setPage(1);
  };

  const handlePaymentTypeChange = (value) => {
    setPaymentType(value);
    setPage(1);
  };

  return (
    <div className="min-h-full p-6 lg:p-8 space-y-6">
      <PaymentContextBar />
      <PaymentHeader onRecordPayment={() => setIsRecordPaymentOpen(true)} />
      <PaymentStats />
      <PaymentFilters
        search={search}
        onSearchChange={handleSearchChange}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={handlePaymentMethodChange}
        paymentStatus={paymentStatus}
        onPaymentStatusChange={handlePaymentStatusChange}
        paymentType={paymentType}
        onPaymentTypeChange={handlePaymentTypeChange}
        onReset={() => {
          setSearch("");
          setPaymentMethod("");
          setPaymentStatus("");
          setPaymentType("");
          setPage(1);
        }}
      />
      <PaymentTable
        payment={data?.payments ?? []}
        isLoading={isLoading}
        isError={isError}
        onView={(paymentId) => setSelectedPaymentId(paymentId)}
      />

      <PaymentPagination
        page={page}
        totalPages={data?.pagination?.totalPages ?? 1}
        total={data?.pagination?.total ?? 0}
        onPageChange={setPage}
      />

      {selectedPaymentId && (
        <PaymentDetailsDrawer
          paymentId={selectedPaymentId}
          onClose={() => setSelectedPaymentId(null)}
        />
      )}

      {isRecordPaymentOpen && (
        <RecordPaymentDrawer onClose={() => setIsRecordPaymentOpen(false)} />
      )}
    </div>
  );
};

export default PaymentsPage;
