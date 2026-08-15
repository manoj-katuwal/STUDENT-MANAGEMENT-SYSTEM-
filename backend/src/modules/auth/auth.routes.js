import express from "express";
import validate from "../../middleware/validate.js";
import { loginSchema, registerUserSchema } from "./auth.validation.js";
import * as authController from "./auth.controller.js";
import authenticate from "../../middleware/authenticate.js";

const router = express.Router();

router.post(
  "/register",
  validate(registerUserSchema),
  authController.registerController,
);
router.post("/login", validate(loginSchema), authController.loginController);
router.post("/refresh", authController.refreshController);
router.post("/logout", authController.logoutController);
router.post("/change-password",authenticate , authController.changePasswordController);
router.post("/logout-all", authenticate,authController.logoutAllSessionsController);
router.get("/verify-email", authController.verifyEmailController);
router.post("/resend-verification", authController.resendVerificationEmailController);

export default router;
