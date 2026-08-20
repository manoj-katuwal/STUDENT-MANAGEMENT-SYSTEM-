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

export const getOverdueFeeTotal = async () => {
  const today = new Date();

  const result = await StudentFee.aggregate([
    {
      $match: {
        dueAmount: {
          $gt: 0,
        },
        dueDate: {
          $lt: today,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalOverdue: {
          $sum: "$dueAmount",
        },
      },
    },
  ]);

  return result[0]?.totalOverdue || 0;
};

export const getStudentDueList = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const result = await StudentFee.aggregate([
    {
      $match: {
        dueAmount: {
          $gt: 0,
        },
      },
    },

    {
      $lookup: {
        from: "students",
        localField: "studentId",
        foreignField: "_id",
        as: "student",
      },
    },

    {
      $unwind: "$student",
    },

    {
      $project: {
        _id: 1,
        dueAmount: 1,
        dueDate: 1,
        status: 1,
        student: {
          _id: "$student._id",
          name: "$student.name",
          admissionNumber: "$student.admissionNumber",
        },
      },
    },

    {
      $sort: {
        dueDate: 1,
      },
    },

    {
      $skip: skip,
    },

    {
      $limit: limit,
    },
  ]);

  return result;
};

export const getPaymentMethodCollection = async () => {
  return await Payment.aggregate([
    {
      $match: {
        paymentStatus: "SUCCESS",
      },
    },
    {
      $group: {
        _id: "$paymentMethod",
        totalCollection: {
          $sum: "$amount",
        },
      },
    },
    {
      $project: {
        _id: 0,
        paymentMethod: "$_id",
        totalCollection: 1,
      },
    },
  ]);
};

export const getRecentPayments = async (limit = 5) => {
  return await Payment.find({
    paymentStatus: "SUCCESS",
  })
    .sort({ paidAt: -1 })
    .limit(limit)
    .populate("studentFeeId", "studentId")
    .lean();
};