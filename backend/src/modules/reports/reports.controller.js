import asyncHandler from "../../shared/utils/asyncHandler.js";
import { successResponse } from "../../shared/utils/response/apiResponse.js";
import {
  getAcademicYearCollectionSummaryService,
  getDashboardSummaryService,
  getMonthlyCollectionService,
  getOverdueFeeTotalService,
  getPaymentMethodCollectionService,
  getPendingFeeTotalService,
  getRecentPaymentsService,
  getStudentDueListService,
  getTodayCollectionService,
} from "./reports.service.js";

export const getTodayCollection = asyncHandler(async (req, res) => {
  const data = await getTodayCollectionService();

  return successResponse({
    res,
    statusCode: 200,
    message: "Today's collection fetched successfully",
    data,
  });
});

export const getMonthlyCollection = asyncHandler(async (req, res) => {
  const data = await getMonthlyCollectionService();

  return successResponse({
    res,
    statusCode: 200,
    message: "Monthly collection fetched successfully",
    data,
  });
});

export const getPendingFeeTotal = asyncHandler(async (req, res) => {
  const data = await getPendingFeeTotalService();

  return successResponse({
    res,
    statusCode: 200,
    message: "Pending fee total fetched successfully",
    data,
  });
});

export const getOverdueFeeTotal = asyncHandler(async (req, res) => {
  const data = await getOverdueFeeTotalService();

  return successResponse({
    res,
    statusCode: 200,
    message: "Overdue fee total fetched successfully",
    data,
  });
});

export const getStudentDueList = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const data = await getStudentDueListService({
    page,
    limit,
  });

  return successResponse({
    res,
    statusCode: 200,
    message: "Student due list fetched successfully",
    data,
  });
});

export const getPaymentMethodCollection = asyncHandler(async (req, res) => {
  const data = await getPaymentMethodCollectionService();

  return successResponse({
    res,
    statusCode: 200,
    message: "Payment method collection fetched successfully",
    data,
  });
});

export const getRecentPayments = asyncHandler(async (req, res) => {
  const limit = req.query.limit || 5;

  const data = await getRecentPaymentsService(limit);

  return successResponse({
    res,
    statusCode: 200,
    message: "Recent payments fetched successfully",
    data,
  });
});

export const getAcademicYearCollectionSummary = asyncHandler(
  async (req, res) => {
    const data = await getAcademicYearCollectionSummaryService();

    return successResponse({
      res,
      statusCode: 200,
      message: "Academic year collection summary fetched successfully",
      data,
    });
  },
);

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const data = await getDashboardSummaryService(req.query.academicYearId);

  return successResponse({
    res,
    statusCode: 200,
    message: "Dashboard summary fetched successfully",
    data,
  });
});

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return "";
  const stringValue = String(value);
  return /[",\r\n]/.test(stringValue)
    ? `"${stringValue.replace(/"/g, '""')}"`
    : stringValue;
};

export const exportDashboardReportCsv = asyncHandler(async (req, res) => {
  const report = await getDashboardSummaryService(req.query.academicYearId);
  const rows = [
    ["Report", "Academic Year", report.academicYear?.name ?? "Not configured"],
    [],
    ["Summary", "Amount"],
    ["Today's Collection", report.todayCollection?.totalCollection ?? 0],
    ["Monthly Collection", report.monthlyCollection?.totalCollection ?? 0],
    ["Pending Fees", report.pendingFee?.totalPending ?? 0],
    ["Overdue Fees", report.overdueFee?.totalOverdue ?? 0],
    [],
    ["Payment Method", "Collection"],
    ...report.paymentMethods.map((item) => [
      item.paymentMethod,
      item.totalCollection,
    ]),
    [],
    ["Academic Year", "Collection"],
    ...report.academicYearSummary.map((item) => [
      item.academicYear?.name,
      item.totalCollection,
    ]),
    [],
    ["Recent Payments"],
    ["Student", "Admission No.", "Amount", "Method", "Paid At", "Status"],
    ...report.recentPayments.map((payment) => [
      payment.studentFeeId?.studentId?.name ?? "N/A",
      payment.studentFeeId?.studentId?.admissionNumber ?? "",
      payment.amount ?? 0,
      payment.paymentMethod ?? "",
      payment.paidAt ? new Date(payment.paidAt).toISOString() : "",
      payment.paymentStatus ?? "",
    ]),
  ];
  const csv = rows.map((row) => row.map(escapeCsvValue).join(",")).join("\r\n");
  const filename = `fee-report-${(report.academicYear?.name ?? "current").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.csv`;

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  return res.status(200).send(csv);
});
