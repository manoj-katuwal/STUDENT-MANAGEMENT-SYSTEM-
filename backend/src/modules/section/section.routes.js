import express from "express";

import {
  createSectionController,
  getSectionByIdController,
  getSectionsController,
  updateSectionController,
  updateSectionStatusController,
} from "./section.controller.js";

import {
  createSectionSchema,
  updateSectionSchema,
  updateSectionStatusSchema,
} from "./section.validation.js";
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
router.get("/:id", authenticate, authorize("ADMIN"), getSectionByIdController);
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(updateSectionSchema),
  updateSectionController,
);
router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  validate(updateSectionStatusSchema),
  updateSectionStatusController,
);
export default router;
