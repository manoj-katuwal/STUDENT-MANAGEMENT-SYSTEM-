import mongoose  from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    studentFeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentFee",
      required: true,
    },
    type: {
      type: String,
      enum: ["FIXED", "PERCENTAGE"],
      required: true,
    },
    value: {
      type: Number,
      required: true,
      min: 0,
    },
    calculatedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    reason: {
      type: String,
      required: false,
      trim: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "REVOKED"],
      default: "ACTIVE",
    },
    appliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Discount = mongoose.model("Discount", discountSchema);
export default Discount;
