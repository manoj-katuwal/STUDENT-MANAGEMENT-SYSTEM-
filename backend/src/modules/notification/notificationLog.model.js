import mongoose from "mongoose";

const notificationLogSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      required: true,
      enum: [
        "Payment",
        "PaymentReversal",
        "Fine",
        "StudentFee",
        "InstallmentPlan",
      ],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      enum: [
        "PAYMENT_RECEIVED",
        "PAYMENT_REVERSED",
        "FINE_IMPOSED",
        "FEE_DUE_REMINDER",
        "INSTALLMENT_OVERDUE",
      ],
    },
    recipientEmail: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["SENT", "FAILED"],
      default: "SENT",
    },
  },
  { timestamps: true },
);

notificationLogSchema.index({
  entityType: 1,
  entityId: 1,
  eventType: 1,
  createdAt: -1,
});

const NotificationLog = mongoose.model(
  "NotificationLog",
  notificationLogSchema,
);

export default NotificationLog;
