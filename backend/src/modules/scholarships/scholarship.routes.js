import express from "express";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";
import { awardScholarshipSchema } from "./scholarship.validation.js";
import { awardScholarship } from "./scholarship.controller.js";


const router = express.Router();
router.post(
  "/",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  validate(awardScholarshipSchema),
  awardScholarship,
);



export default router;