import mongoose from "mongoose";

const fineSchema = new mongoose.Schema(
  {
    studentFeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentFee",
      required: true,
    },
    finePolicyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FinePolicy",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    overdueDays: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "WAIVED", "REVERSED"],
      default: "ACTIVE",
    },
    lastCalculatedAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

fineSchema.index(
  { studentFeeId: 1, finePolicyId: 1 },
  { unique: true, partialFilterExpression: { status: "ACTIVE" } },
);

export default mongoose.model("Fine", fineSchema);
