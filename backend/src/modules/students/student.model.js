import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      unique: true,
      sparse: true,
    },

    admissionNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: ["MALE", "FEMALE", "OTHER"],
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    address: {
      type: String,
      trim: true,
      default: null,
    },

    guardian: {
      name: {
        type: String,
        trim: true,
        default: null,
      },

      relationship: {
        type: String,
        trim: true,
        default: null,
      },

      phone: {
        type: String,
        trim: true,
        default: null,
      },
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

const Student = mongoose.model("Student", studentSchema);

export default Student;
