import Joi from "joi";

const objectId = () => Joi.string().hex().length(24);

export const installmentItemSchema = Joi.object({
  installmentNumber: Joi.number().integer().min(1).required(),
  amount: Joi.number().positive().precision(2).required(),
  // The service requires and orders these dates when dueDateMode is MANUAL.
  dueDate: Joi.date().iso().optional(),
});

export const createInstallmentPlanSchema = Joi.object({
  studentId: objectId().required(),
  academicYearId: objectId().required(),
  feeStructureId: objectId().required(),
  totalAmount: Joi.number().positive().precision(2).required(),
  numberOfInstallments: Joi.number().integer().min(2).max(24).required(),
  dueDateMode: Joi.string().valid("MANUAL", "AUTO").required(),
  frequency: Joi.string()
    .valid("MONTHLY", "QUARTERLY", "CUSTOM_DAYS")
    .when("dueDateMode", {
      is: "AUTO",
      then: Joi.required(),
      otherwise: Joi.forbidden(),
    }),
  startDate: Joi.date().iso().when("dueDateMode", {
    is: "AUTO",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  intervalDays: Joi.number().integer().min(1).when("frequency", {
    is: "CUSTOM_DAYS",
    then: Joi.required(),
    otherwise: Joi.forbidden(),
  }),
  installments: Joi.array().items(installmentItemSchema).min(2).required(),
});
