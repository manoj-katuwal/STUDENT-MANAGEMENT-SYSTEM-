import {
  getAcademicYearCollectionSummary,
  getMonthlyCollection,
  getOverdueFeeTotal,
  getPaymentMethodCollection,
  getPendingFeeTotal,
  getRecentPayments,
  getStudentDueList,
  getTodayCollection,
} from "./reports.repository.js";

export const getTodayCollectionService = async () => {
  const totalCollection = await getTodayCollection();

  return {
    totalCollection,
  };
};

export const getMonthlyCollectionService = async () => {
  const totalCollection = await getMonthlyCollection();

  return {
    totalCollection,
  };
};

export const getPendingFeeTotalService = async () => {
  const totalPending = await getPendingFeeTotal();

  return {
    totalPending,
  };
};

export const getOverdueFeeTotalService = async () => {
  const totalOverdue = await getOverdueFeeTotal();

  return {
    totalOverdue,
  };
};

export const getStudentDueListService = async ({ page = 1, limit = 10 }) => {
  const data = await getStudentDueList({
    page: Number(page),
    limit: Number(limit),
  });

  return data;
};

export const getPaymentMethodCollectionService = async () => {
  const data = await getPaymentMethodCollection();

  console.log("2. Service completed:", data);

  return data;
};

export const getRecentPaymentsService = async (limit = 5) => {
  const payments = await getRecentPayments(Number(limit));

  return payments;
};

export const getAcademicYearCollectionSummaryService = async () => {
  const data = await getAcademicYearCollectionSummary();

  return data;
};

export const getDashboardSummaryService = async () => {
  const [
    todayCollection,
    monthlyCollection,
    pendingFee,
    overdueFee,
    paymentMethods,
    recentPayments,
    academicYearSummary,
  ] = await Promise.all([
    getTodayCollectionService(),
    getMonthlyCollectionService(),
    getPendingFeeTotalService(),
    getOverdueFeeTotalService(),
    getPaymentMethodCollectionService(),
    getRecentPaymentsService(),
    getAcademicYearCollectionSummaryService(),
  ]);

  return {
    todayCollection,
    monthlyCollection,
    pendingFee,
    overdueFee,
    paymentMethods,
    recentPayments,
    academicYearSummary,
  };
};
