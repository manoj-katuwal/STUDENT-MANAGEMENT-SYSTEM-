import Joi from "joi";

export const createStudentSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  admissionNumber: Joi.string().trim().min(1).max(50).required(),

  dateOfBirth: Joi.date().iso().allow(null),

  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").allow(null, ""),

  phone: Joi.string().trim().allow(null, ""),

  address: Joi.string().trim().allow(null, ""),

  guardian: Joi.object({
    name: Joi.string().trim().allow(null, ""),
    relationship: Joi.string().trim().allow(null, ""),
    phone: Joi.string().trim().allow(null, ""),
  }).allow(null),

  status: Joi.string().valid("ACTIVE", "INACTIVE").default("ACTIVE"),

  userId: Joi.string()
    .trim()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .allow(null, ""),
})
  .unknown(true)
  .required();
