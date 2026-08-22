import mongoose from "mongoose";

const finePolicySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["FIXED", "DAILY_FIXED", "PERCENTAGE"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    gracePeriodDays: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxFineAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    applicableFeeTypes: {
      type: [String],
      enum: ["TUITION", "TRANSPORT", "EXAM"],
      required: true,
    },
    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

finePolicySchema.index({ academicYearId: 1, status: 1 });

export default mongoose.model("FinePolicy", finePolicySchema);
