import Joi from "joi";

export const registerUserSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),

  email: Joi.string().trim().lowercase().email().required(),

  password: Joi.string().min(8).max(128).required(),

  role: Joi.string()
    .trim()
    .uppercase()
    .valid("ADMIN", "ACCOUNTANT", "PRINCIPAL", "STUDENT")
    .default("STUDENT"),
});

export const loginSchema = Joi.object({
  email: Joi.string().trim().lowercase().email().required(),

  password: Joi.string().required(),
});
