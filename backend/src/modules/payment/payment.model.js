import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    studentFeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentFee",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: ["CASH", "BANK_TRANSFER", "CHEQUE", "ESEWA", "KHALTI"],
      required: true,
    },

    paymentType: {
      type: String,
      enum: ["OFFLINE", "ONLINE"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REVERSED"],
      default: "SUCCESS",
    },

    transactionId: {
      type: String,
      default: null,
      trim: true,
    },

    gatewayTransactionId: {
      type: String,
      default: null,
      trim: true,
    },

    gateway: {
      type: String,
      enum: ["ESEWA", "KHALTI", null],
      default: null,
    },

    paidAt: {
      type: Date,
      default: Date.now,
    },

    remarks: {
      type: String,
      trim: true,
      default: null,
    },

  },
  {
    timestamps: true,
  },
);

paymentSchema.index({
  studentFeeId: 1,
  createdAt: -1,
});

paymentSchema.index(
  { transactionId: 1 },
  {
    unique: true,
    sparse: true,
  },
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
