import express from "express";

import { login } from "./auth.controller.js";

import { loginSchema } from "./auth.validation.js";
import validate from "../../middleware/validate.js";

const router = express.Router();

router.post("/login", validate(loginSchema), login);

export default router;
