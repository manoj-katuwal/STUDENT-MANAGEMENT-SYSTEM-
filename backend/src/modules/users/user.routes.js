import { Router } from "express";

import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import validate from "../../middleware/validate.js";
import {
  activateUserController,
  changeUserRoleController,
  createUserController,
  deactivateUserController,
  deleteUserController,
  getAllUsersController,
  getMyProfileController,
  getUserByIdController,
  registerUserController,
  updateMyProfileController,
} from "./user.controller.js";
import { registerUserSchema } from "./user.validation.js";

const router = Router();

router.post("/register", validate(registerUserSchema), registerUserController);
router.get("/me", authenticate, getMyProfileController);
router.patch("/me", authenticate, updateMyProfileController);

router.post("/", authenticate, authorize("ADMIN"), createUserController);
router.get("/", authenticate, authorize("ADMIN"), getAllUsersController);
router.get("/:userId", authenticate, authorize("ADMIN"), getUserByIdController);
router.patch(
  "/:userId/role",
  authenticate,
  authorize("ADMIN"),
  changeUserRoleController,
);
router.patch(
  "/:userId/activate",
  authenticate,
  authorize("ADMIN"),
  activateUserController,
);
router.patch(
  "/:userId/deactivate",
  authenticate,
  authorize("ADMIN"),
  deactivateUserController,
);
router.delete(
  "/:userId",
  authenticate,
  authorize("ADMIN"),
  deleteUserController,
);

export default router;
