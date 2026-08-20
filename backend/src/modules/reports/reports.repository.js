import Payment from "../payment/payment.model.js";
import StudentFee from "../studentFee/studentFee.model.js";

export const getTodayCollection = async () => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const result = await Payment.aggregate([
    {
      $match: {
        paymentStatus: "SUCCESS",
        paidAt: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalCollection: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return result[0]?.totalCollection || 0;
};

export const getMonthlyCollection = async () => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const endOfMonth = new Date();
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  endOfMonth.setDate(0);
  endOfMonth.setHours(23, 59, 59, 999);

  const result = await Payment.aggregate([
    {
      $match: {
        paymentStatus: "SUCCESS",
        paidAt: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalCollection: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return result[0]?.totalCollection || 0;
};

export const getPendingFeeTotal = async () => {
  const result = await StudentFee.aggregate([
    {
      $match: {
        dueAmount: {
          $gt: 0,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalPending: {
          $sum: "$dueAmount",
        },
      },
    },
  ]);

  return result[0]?.totalPending || 0;
};
