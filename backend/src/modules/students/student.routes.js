import express from "express";

import {
  createStudentController,
  getStudentByIdController,
  getStudentsController,
  updateStudentController,
  updateStudentStatusController,
} from "./student.controller.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";
import {
  createStudentSchema,
  updateStudentSchema,
  updateStudentStatusSchema,
} from "./student.validation.js";

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
router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN"),
  validate(updateStudentSchema),
  updateStudentController,
);
router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN"),
  validate(updateStudentStatusSchema),
  updateStudentStatusController,
);

export default router;
