import Joi from "joi";

export const createClassSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),

  code: Joi.string().trim().min(2).max(20).uppercase().required(),
});


export const updateClassSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50),

  code: Joi.string().trim().min(2).max(20).uppercase(),
}).min(1);

export const updateClassStatusSchema = Joi.object({
  status: Joi.string().valid("ACTIVE", "INACTIVE").required(),
});
