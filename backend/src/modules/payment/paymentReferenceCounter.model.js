import mongoose from "mongoose";

const paymentReferenceCounterSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
      unique: true,
    },
    sequence: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

const PaymentReferenceCounter = mongoose.model(
  "PaymentReferenceCounter",
  paymentReferenceCounterSchema,
);

export default PaymentReferenceCounter;
