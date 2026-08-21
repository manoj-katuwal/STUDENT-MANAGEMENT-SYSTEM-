import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["MERIT", "NEED_BASED", "SPONSOR", "GOVERNMENT", "OTHER"],
      required: true,
    },
    valueType: {
      type: String,
      enum: ["FIXED", "PERCENTAGE"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    sponsor: {
      type: String,
      trim: true,
      default: null,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "CANCELLED"],
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

scholarshipSchema.index({ studentId: 1, academicYearId: 1 });

export default mongoose.model("Scholarship", scholarshipSchema);
