import Joi from "joi";

export const applyDiscountSchema = Joi.object({
  studentFeeId: Joi.string().hex().length(24).required(),
  type: Joi.string().valid("FIXED", "PERCENTAGE").required(),
  value: Joi.number().positive().required(),
  reason: Joi.string().min(3).max(200).required(),
});
