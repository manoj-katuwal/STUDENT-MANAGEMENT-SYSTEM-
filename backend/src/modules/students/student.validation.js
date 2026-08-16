import Joi from "joi";

export const createStudentSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  admissionNumber: Joi.string().trim().min(3).max(50).required(),

  dateOfBirth: Joi.date().iso().allow(null),

  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").allow(null),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .allow(null),

  address: Joi.string().trim().max(255).allow(null),

  guardian: Joi.object({
    name: Joi.string().trim().max(100).allow(null),

    relationship: Joi.string().trim().max(50).allow(null),

    phone: Joi.string()
      .trim()
      .pattern(/^[0-9]{10}$/)
      .allow(null),
  }).allow(null),
});

export const updateStudentSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100),

  admissionNumber: Joi.string().trim().min(3).max(50),

  dateOfBirth: Joi.date().iso().allow(null),

  gender: Joi.string().valid("MALE", "FEMALE", "OTHER").allow(null),

  phone: Joi.string()
    .trim()
    .pattern(/^[0-9]{10}$/)
    .allow(null),

  address: Joi.string().trim().max(255).allow(null),

  guardian: Joi.object({
    name: Joi.string().trim().max(100).allow(null),

    relationship: Joi.string().trim().max(50).allow(null),

    phone: Joi.string()
      .trim()
      .pattern(/^[0-9]{10}$/)
      .allow(null),
  }).allow(null),
}).min(1);


export const updateStudentStatusSchema = Joi.object({
  status: Joi.string().valid("ACTIVE", "INACTIVE").required(),
});
