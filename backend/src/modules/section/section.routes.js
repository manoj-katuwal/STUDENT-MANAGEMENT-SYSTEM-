import express from "express";

import {
  createSectionController,
  getSectionsController,
} from "./section.controller.js";

import { createSectionSchema } from "./section.validation.js";
import authenticate from "../../middleware/authenticate.js";
import validate from "../../middleware/validate.js";
import authorize from "../../middleware/authorize.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createSectionSchema),
  createSectionController,
);
router.get("/", authenticate, authorize("ADMIN"), getSectionsController);
export default router;
