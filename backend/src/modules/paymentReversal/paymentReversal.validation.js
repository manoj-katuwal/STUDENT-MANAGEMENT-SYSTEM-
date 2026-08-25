import Joi from "joi";

export const reversePaymentSchema = Joi.object({
  reason: Joi.string().trim().min(5).max(300).required().messages({
    "string.min": "Reason must be at least 5 characters",
    "any.required": "Reason is required to reverse a payment",
  }),
});
