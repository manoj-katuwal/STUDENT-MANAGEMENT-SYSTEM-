import express from "express";

import { createStudentController, getStudentsController } from "./student.controller.js";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";


const router = express.Router();

router.post("/", authenticate, authorize("ADMIN"), createStudentController);
router.get("/", authenticate, authorize("ADMIN"), getStudentsController);

export default router;
