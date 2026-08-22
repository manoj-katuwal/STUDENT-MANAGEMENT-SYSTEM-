import Joi from "joi";

export const createFinePolicySchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  type: Joi.string().valid("FIXED", "DAILY_FIXED", "PERCENTAGE").required(),
  amount: Joi.number().positive().required(),
  gracePeriodDays: Joi.number().min(0).default(0),
  maxFineAmount: Joi.number().positive().required(),
  applicableFeeTypes: Joi.array()
    .items(Joi.string().valid("TUITION", "TRANSPORT", "EXAM"))
    .min(1)
    .required(),
  academicYearId: Joi.string().hex().length(24).required(),
});
