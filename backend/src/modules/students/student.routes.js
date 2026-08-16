import express from "express";

import {
  createStudentController,
  getStudentByIdController,
  getStudentsController,
  updateStudentController,
} from "./student.controller.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";
import { createStudentSchema } from "./student.validation.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createStudentSchema),
  createStudentController,
);
router.get("/", authenticate, authorize("ADMIN"), getStudentsController);
router.get("/:id", authenticate, authorize("ADMIN"), getStudentByIdController);
router.patch("/:id", authenticate, authorize("ADMIN"), updateStudentController);

export default router;
