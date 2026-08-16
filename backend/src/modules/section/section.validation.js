import Joi from "joi";

export const createSectionSchema = Joi.object({
  name: Joi.string().trim().min(1).max(30).uppercase().required(),

  classId: Joi.string().hex().length(24).required(),
});
