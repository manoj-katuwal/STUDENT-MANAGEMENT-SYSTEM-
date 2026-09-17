import { findStudentFeeIdsByStudentIds } from "../studentFee/studentFee.repository.js";
import Student from "../students/student.model.js";
import Payment from "./payment.model.js";

export const createPayment = async (paymentData, options = {}) => {
  return await Payment.create([paymentData], options).then(
    (result) => result[0],
  );
};

export const findPaymentById = async (paymentId, options = {}) => {
  return await Payment.findById(paymentId, null, options);
};

export const findPaymentByTransactionId = async (
  transactionId,
  options = {},
) => {
  return await Payment.findOne({ transactionId }, null, options);
};

export const findPendingPaymentByStudentFeeId = async (
  studentFeeId,
  gateway,
) => {
  return await Payment.findOne({
    studentFeeId,
    gateway,
    paymentStatus: "PENDING",
  }).sort({ createdAt: -1 });
};

export const findPaymentsByStudentFeeId = async (studentFeeId) => {
  return await Payment.find({ studentFeeId }).sort({ createdAt: -1 });
};

export const findPayments = async ({
  filter = {},
  search,
  skip = 0,
  limit = 10,
}) => {
  let query = filter;

  if (search) {
    const matchingStudents = await Student.find({
      $or: [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          admissionNumber: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    }).select("_id");

    const studentIds = matchingStudents.map((student) => student._id);

    const studentFeeIds = await findStudentFeeIdsByStudentIds(studentIds);

    query = {
      ...filter,
      $or: [
        {
          transactionId: {
            $regex: search,
            $options: "i",
          },
        },
        {
          studentFeeId: {
            $in: studentFeeIds,
          },
        },
      ],
    };
  }

  return await Payment.find(query)
    .populate({
      path: "studentFeeId",
      populate: [
        {
          path: "studentId",
          select: "name admissionNumber",
        },
        {
          path: "academicYearId",
          select: "name",
        },
        {
          path: "feeStructureId",
          select: "feeType amount",
        },
      ],
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

export const countPayments = async ({ filter = {}, search } = {}) => {
  let query = filter;

  if (search) {
    const matchingStudents = await Student.find({
      $or: [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          admissionNumber: {
            $regex: search,
            $options: "i",
          },
        },
      ],
    }).select("_id");

    const studentIds = matchingStudents.map((student) => student._id);

    const studentFeeIds = await findStudentFeeIdsByStudentIds(studentIds);

    query = {
      ...filter,
      $or: [
        {
          transactionId: {
            $regex: search,
            $options: "i",
          },
        },
        {
          studentFeeId: {
            $in: studentFeeIds,
          },
        },
      ],
    };
  }

  return await Payment.countDocuments(query);
};

export const getPaymentStats = async () => {
  return await Payment.aggregate([
    {
      $facet: {
        totalCollected: [
          { $match: { paymentStatus: "SUCCESS" } },
          {
            $group: {
              _id: null,
              amount: { $sum: "$amount" },
            },
          },
        ],

        pendingAmount: [
          { $match: { paymentStatus: "PENDING" } },
          {
            $group: {
              _id: null,
              amount: { $sum: "$amount" },
            },
          },
        ],

        successfulPayments: [
          { $match: { paymentStatus: "SUCCESS" } },
          { $count: "total" },
        ],

        pendingPayments: [
          { $match: { paymentStatus: "PENDING" } },
          { $count: "total" },
        ],

        failedPayments: [
          { $match: { paymentStatus: "FAILED" } },
          { $count: "total" },
        ],

        todayCollection: [
          {
            $match: {
              paymentStatus: "SUCCESS",
              paidAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0)),
              },
            },
          },
          {
            $group: {
              _id: null,
              amount: { $sum: "$amount" },
              transactions: { $sum: 1 },
            },
          },
        ],

        thisMonth: [
          {
            $match: {
              paymentStatus: "SUCCESS",
              paidAt: {
                $gte: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  1,
                ),
              },
            },
          },
          {
            $group: {
              _id: null,
              amount: { $sum: "$amount" },
            },
          },
        ],

        transactions: [{ $count: "total" }],
      },
    },
  ]);
};
