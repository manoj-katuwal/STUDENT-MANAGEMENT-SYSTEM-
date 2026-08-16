import express from "express";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";
import { createClassSchema, updateClassSchema } from "./class.validation.js";
import {
  createClassController,
  getClassByIdController,
  getClassesController,
  updateClassController,
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

export default router;
