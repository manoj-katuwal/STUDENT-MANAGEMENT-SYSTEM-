import express from "express";

import {
  createStudentController,
  getStudentByIdController,
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
  listStudentsQuerySchema,
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
  authorize("ADMIN", "ACCOUNTANT"),
  getStudentsController,
);

router.get(
  "/stats",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  getStudentStatsController,
);
router.get(
  "/export/csv",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  validateQuery(exportStudentsQuerySchema),
  getStudentsCsvController,
);

router.get(
  "/:id",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT"),
  // No query validation needed for fetching a single student by ID
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
