import express from "express";

import {
  createStudentController,
  getStudentByIdController,
  getStudentMeController,
  getStudentsController,
  getStudentsCsvController,
  getStudentStatsController,
  updateStudentController,
  updateStudentStatusController,
} from "./student.controller.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";
import {
  createStudentSchema,
  exportStudentsQuerySchema,
  updateStudentSchema,
  updateStudentStatusSchema,
} from "./student.validation.js";
import validateQuery from "../../middleware/validateQuery.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  validate(createStudentSchema),
  createStudentController,
);

router.get(
  "/",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getStudentsController,
);

router.get(
  "/stats",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getStudentStatsController,
);

router.get(
  "/export/csv",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  validateQuery(exportStudentsQuerySchema),
  getStudentsCsvController,
);

// IMPORTANT: static /me route before /:id param route
router.get("/me", authenticate, authorize("STUDENT"), getStudentMeController);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getStudentByIdController,
);

router.patch(
  "/:id",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  validate(updateStudentSchema),
  updateStudentController,
);

router.patch(
  "/:id/status",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  validate(updateStudentStatusSchema),
  updateStudentStatusController,
);

export default router;
