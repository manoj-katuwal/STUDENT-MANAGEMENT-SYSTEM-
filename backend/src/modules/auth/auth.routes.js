import express from "express";
import validate from "../../middleware/validate.js";
import { loginSchema, registerUserSchema } from "./auth.validation.js";
import * as authController from "./auth.controller.js";

const router = express.Router();

router.post(
  "/register",
  validate(registerUserSchema),
  authController.registerController,
);
router.post("/login", validate(loginSchema), authController.loginContoller);

export default router;
