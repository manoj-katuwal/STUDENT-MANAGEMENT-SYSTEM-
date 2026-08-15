import { Router } from "express";

import { registerUserController } from "./user.controller.js";
import { registerUserSchema } from "./user.validation.js";

import validate from "../../middleware/validate.js";

const router = Router();

router.post("/", validate(registerUserSchema), registerUserController);

export default router;
