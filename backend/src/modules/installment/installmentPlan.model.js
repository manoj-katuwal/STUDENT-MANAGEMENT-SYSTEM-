import mongoose from "mongoose";

const { Schema } = mongoose;

const installmentSchema = new Schema(
  {
    installmentNumber: {
      type: Number,
      required: true,
      min: 1,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    studentFeeId: {
      type: Schema.Types.ObjectId,
      ref: "StudentFee",
      default: null,
    },
  },
  { _id: false },
);

const installmentPlanSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    academicYearId: {
      type: Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },
    feeStructureId: {
      type: Schema.Types.ObjectId,
      ref: "FeeStructure",
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    numberOfInstallments: {
      type: Number,
      required: true,
      min: 2,
    },
    dueDateMode: {
      type: String,
      enum: ["MANUAL", "AUTO"],
      required: true,
    },
    frequency: {
      type: String,
      enum: ["MONTHLY", "QUARTERLY", "CUSTOM_DAYS"],
      required: function () {
        return this.dueDateMode === "AUTO";
      },
    },
    intervalDays: {
      type: Number,
      min: 1,
      required: function () {
        return this.dueDateMode === "AUTO" && this.frequency === "CUSTOM_DAYS";
      },
    },
    installments: {
      type: [installmentSchema],
      required: true,
      validate: {
        validator: function (arr) {
          return arr.length === this.numberOfInstallments;
        },
        message: "installments array length numberOfInstallments sanga milena",
      },
    },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED"],
      default: "ACTIVE",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// Ek student ko ek academicYear+feeStructure ma euta matra ACTIVE plan hunuparxa
installmentPlanSchema.index(
  { studentId: 1, academicYearId: 1, feeStructureId: 1 },
  {
    unique: true,
    partialFilterExpression: { status: "ACTIVE" },
  },
);

export default mongoose.model("InstallmentPlan", installmentPlanSchema);
