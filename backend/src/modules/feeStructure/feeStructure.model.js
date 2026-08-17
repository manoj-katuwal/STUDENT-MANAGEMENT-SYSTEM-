import mongoose from "mongoose";

const feeStructureSchema = new mongoose.Schema(
  {
    academicYearId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicYear",
      required: true,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    feeType: {
      type: String,
      enum: ["TUITION", "TRANSPORT", "EXAM"],
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  },
);

feeStructureSchema.index(
  {
    academicYearId: 1,
    classId: 1,
    feeType: 1,
  },
  {
    unique: true,
  },
);

const FeeStructure = mongoose.model("FeeStructure", feeStructureSchema);

export default FeeStructure;
