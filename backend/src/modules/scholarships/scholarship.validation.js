import Joi from "joi";

export const awardScholarshipSchema = Joi.object({
  studentId: Joi.string().hex().length(24).required(),
  academicYearId: Joi.string().hex().length(24).required(),
  name: Joi.string().min(3).max(100).required(),
  type: Joi.string()
    .valid("MERIT", "NEED_BASED", "SPONSOR", "GOVERNMENT", "OTHER")
    .required(),
  valueType: Joi.string().valid("FIXED", "PERCENTAGE").required(),
  value: Joi.number().positive().required(),
  sponsor: Joi.string().trim().allow(null, "").optional(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
});
