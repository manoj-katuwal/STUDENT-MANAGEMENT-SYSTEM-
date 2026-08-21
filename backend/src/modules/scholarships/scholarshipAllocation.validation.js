import Joi from "joi";

export const allocateScholarshipSchema = Joi.object({
  scholarshipId: Joi.string().hex().length(24).required(),
  studentFeeId: Joi.string().hex().length(24).required(),
  amount: Joi.number().positive().optional(),
});
