import express from "express";
import { createUser } from "./user.controller.js";
import validate from "../../middleware/validate.js";
import { createUserSchema } from "./user.validation.js";
import authenticate from "../../middleware/authenticate.js";
import * as userController from "./user.controller.js";
import authorize from "../../middleware/authorize.js";
import * as authController from "../auth/auth.controller.js"


const router = express.Router();

router.post("/login", validate(createUserSchema), createUser);
router.get("/me", authenticate, userController.getMe);
// router.get("/admin/users", authenticate, authorize("ADMIN"), authController.adminTest);
// router.get("/admin-test", authenticate, authorize("ADMIN"), authController.adminTest);

export default router;
