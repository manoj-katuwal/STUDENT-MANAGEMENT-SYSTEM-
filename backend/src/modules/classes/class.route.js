import express from "express";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";
import {
  createClassSchema,
  exportClassesQuerySchema,
  listClassesQuerySchema,
  updateClassSchema,
  updateClassStatusSchema,
} from "./class.validation.js";
import {
  createClassController,
  getClassByIdController,
  getClassesCsvController,
  getClassesController,
  getClassStatsController,
  updateClassController,
  updateClassStatusController,
} from "./class.controller.js";
import validateQuery from "../../middleware/validateQuery.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createClassSchema),
  createClassController,
);
router.get("/", authenticate, authorize("ADMIN"), getClassesController);
router.get("/stats", authenticate, authorize("ADMIN"), getClassStatsController);

router.get(
  "/export/csv",
  authenticate,
  authorize("ADMIN"),
  validateQuery(exportClassesQuerySchema),
  getClassesCsvController,
);

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

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  validateQuery(listClassesQuerySchema),
  getClassesController,
);

export default router;
