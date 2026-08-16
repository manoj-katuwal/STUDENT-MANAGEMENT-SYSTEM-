import Joi from "joi";

export const createSectionSchema = Joi.object({
  name: Joi.string().trim().min(1).max(30).uppercase().required(),

  classId: Joi.string().hex().length(24).required(),
});

export const updateSectionSchema = Joi.object({
  name: Joi.string().trim().min(1).max(30).uppercase(),

  classId: Joi.string().hex().length(24),
}).min(1);

export const updateSectionStatusSchema = Joi.object({
  status: Joi.string().valid("ACTIVE", "INACTIVE").required(),
});
