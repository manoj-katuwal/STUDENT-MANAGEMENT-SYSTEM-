import mongoose from "mongoose";

const scholarshipAllocationSchema = new mongoose.Schema(
  {
    scholarshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scholarship",
      required: true,
    },
    studentFeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentFee",
      required: true,
    },
    allocatedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "CANCELLED"],
      default: "ACTIVE",
    },
    allocatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

scholarshipAllocationSchema.index({ scholarshipId: 1 });
scholarshipAllocationSchema.index({ studentFeeId: 1 });

export default mongoose.model(
  "ScholarshipAllocation",
  scholarshipAllocationSchema,
);
