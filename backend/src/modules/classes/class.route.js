import express from "express";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";
import { createClassSchema, updateClassSchema, updateClassStatusSchema } from "./class.validation.js";
import {
  createClassController,
  getClassByIdController,
  getClassesController,
  updateClassController,
  updateClassStatusController,
} from "./class.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createClassSchema),
  createClassController,
);
router.get("/", authenticate, authorize("ADMIN"), getClassesController);
router.get("/:id", authenticate, authorize("ADMIN"), getClassByIdController);
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(updateClassSchema),
  updateClassController,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  validate(updateClassStatusSchema),
  updateClassStatusController,
);

export default router;
