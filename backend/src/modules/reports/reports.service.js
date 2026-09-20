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
import {
  findAcademicYearById,
  findCurrentAcademicYear,
} from "../academicYear/academicYear.repository.js";
import AppError from "../../shared/utils/error/AppError.js";

export const getTodayCollectionService = async (academicYearId) => {
  const totalCollection = await getTodayCollection(academicYearId);

  return {
    totalCollection,
  };
};

export const getMonthlyCollectionService = async (academicYearId) => {
  const totalCollection = await getMonthlyCollection(academicYearId);

  return {
    totalCollection,
  };
};

export const getPendingFeeTotalService = async (academicYearId) => {
  const totalPending = await getPendingFeeTotal(academicYearId);

  return {
    totalPending,
  };
};

export const getOverdueFeeTotalService = async (academicYearId) => {
  const totalOverdue = await getOverdueFeeTotal(academicYearId);

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

export const getPaymentMethodCollectionService = async (academicYearId) => {
  return await getPaymentMethodCollection(academicYearId);
};

export const getRecentPaymentsService = async (limit = 5, academicYearId) => {
  const payments = await getRecentPayments(Number(limit), academicYearId);

  return payments;
};

export const getAcademicYearCollectionSummaryService = async (academicYearId) => {
  const data = await getAcademicYearCollectionSummary(academicYearId);

  return data;
};

export const getDashboardSummaryService = async (academicYearId) => {
  const academicYear = academicYearId
    ? await findAcademicYearById(academicYearId)
    : await findCurrentAcademicYear();

  if (academicYearId && !academicYear) {
    throw new AppError("Academic year not found", 404);
  }

  const selectedAcademicYearId = academicYear?._id;
  const [
    todayCollection,
    monthlyCollection,
    pendingFee,
    overdueFee,
    paymentMethods,
    recentPayments,
    academicYearSummary,
  ] = await Promise.all([
    getTodayCollectionService(selectedAcademicYearId),
    getMonthlyCollectionService(selectedAcademicYearId),
    getPendingFeeTotalService(selectedAcademicYearId),
    getOverdueFeeTotalService(selectedAcademicYearId),
    getPaymentMethodCollectionService(selectedAcademicYearId),
    getRecentPaymentsService(5, selectedAcademicYearId),
    getAcademicYearCollectionSummaryService(selectedAcademicYearId),
  ]);

  return {
    todayCollection,
    monthlyCollection,
    pendingFee,
    overdueFee,
    paymentMethods,
    recentPayments,
    academicYearSummary,
    academicYear,
  };
};
