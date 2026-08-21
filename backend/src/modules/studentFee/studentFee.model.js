import mongoose from "mongoose";

const studentFeeSchema = new mongoose.Schema(
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

    feeStructureId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeeStructure",
      required: true,
    },

    // Original amount from Fee Structure
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Student-specific discount
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Amount after discount
    netAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    dueAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["PENDING", "PARTIAL", "PAID", "CANCELLED"],
      default: "PENDING",
    },
    scholarshipAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

studentFeeSchema.index(
  {
    studentId: 1,
    academicYearId: 1,
    feeStructureId: 1,
  },
  {
    unique: true,
  },
);

const StudentFee = mongoose.model("StudentFee", studentFeeSchema);

export default StudentFee;
