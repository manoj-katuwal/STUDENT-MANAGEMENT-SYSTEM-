import express from "express";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";
import { createClassSchema } from "./class.validation.js";
import { createClassController } from "./class.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createClassSchema),
  createClassController,
);

export default router;
