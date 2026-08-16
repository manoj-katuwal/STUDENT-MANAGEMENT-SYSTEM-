import Joi from "joi";

export const createClassSchema = Joi.object({
  name: Joi.string().trim().min(2).max(50).required(),

  code: Joi.string().trim().min(2).max(20).uppercase().required(),
});
