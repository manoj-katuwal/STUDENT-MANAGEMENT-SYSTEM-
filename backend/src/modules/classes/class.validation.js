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

export const listClassesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().trim().allow("").default(""),
  status: Joi.string().trim().valid("ACTIVE", "INACTIVE").allow("").default(""),
});



