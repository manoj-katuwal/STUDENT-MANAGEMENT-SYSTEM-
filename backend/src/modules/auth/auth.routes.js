import express from "express";

import { login } from "./auth.controller.js";

import { loginSchema } from "./auth.validation.js";
import validate from "../../middleware/validate.js";
// import authenticate from "../../middleware/authenticate.js";
// import * as authController from "./auth.controller.js";

const router = express.Router();

router.post("/login", validate(loginSchema), login);
// router.get("/me", authenticate, authController.get)

export default router;
