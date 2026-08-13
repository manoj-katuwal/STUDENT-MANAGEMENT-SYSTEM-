import express from "express";
import { createUser } from "./user.controller.js";
import validate from "../../middleware/validate.js";
import { createUserSchema } from "./user.validation.js";

const router = express.Router();

router.post("/", validate(createUserSchema), createUser);

export default router;
