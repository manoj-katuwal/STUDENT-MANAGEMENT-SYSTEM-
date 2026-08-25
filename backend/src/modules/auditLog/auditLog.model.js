import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    entityType: {
      type: String,
      required: true,
      enum: [
        "StudentFee",
        "Payment",
        "PaymentReversal",
        "Discount",
        "Fine",
        "InstallmentPlan",
      ],
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    action: {
      type: String,
      required: true, // e.g. CREATED, UPDATED, CANCELLED, REVERSED, WAIVED
    },
    description: {
      type: String,
      required: true,
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }, //
);

auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });

const AuditLog = mongoose.model("AuditLog", auditLogSchema);

export default AuditLog;
