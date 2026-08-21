import express from "express";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";
import { allocateScholarshipSchema } from "./scholarshipAllocation.validation.js";
import { allocateScholarship } from "./scholarshipAllocation.controller.js";


const router = express.Router();

router.post(
  "/",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  validate(allocateScholarshipSchema),
  allocateScholarship,
);



export default router;