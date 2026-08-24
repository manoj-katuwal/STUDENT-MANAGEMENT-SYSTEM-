import mongoose from "mongoose";

const paymentReversalSchema = new mongoose.Schema(
  {
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
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
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    reversedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

paymentReversalSchema.index({ paymentId: 1 }, { unique: true });

const PaymentReversal = mongoose.model(
  "PaymentReversal",
  paymentReversalSchema,
);

export default PaymentReversal;
