import express from "express";
import authenticate from "../../middleware/authenticate.js";
import {
  createAcademicYearController,
  getAcademicYearByIdController,
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

export default router;
