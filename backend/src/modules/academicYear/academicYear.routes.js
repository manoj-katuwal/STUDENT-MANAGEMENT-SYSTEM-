import express from "express";
import authenticate from "../../middleware/authenticate.js";
import {
  createAcademicYearController,
  getAcademicYearByIdController,
  getAcademicYearsController,
  updateAcademicYearController,
} from "./academicYear.controller.js";
import authorize from "../../middleware/authorize.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  createAcademicYearController,
);

router.get(
  "/:academicYearId",
  authenticate,
  authorize("ADMIN"),
  getAcademicYearByIdController,
);

router.get("/", authenticate, authorize("ADMIN"), getAcademicYearsController);

router.patch(
  "/:academicYearId",
  authenticate,
  authorize("ADMIN"),
  updateAcademicYearController,
);

export default router;
