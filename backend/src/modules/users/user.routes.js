import { Router } from "express";

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
router.get("/me", getMyProfileController);
router.patch("/me", updateMyProfileController);

router.post("/", authorize("ADMIN"), createUserController);
router.get("/", authorize("ADMIN"), getAllUsersController);
router.get("/:userId", authorize("ADMIN"), getUserByIdController);
router.patch("/:userId/role", authorize("ADMIN"), changeUserRoleController);
router.patch("/:userId/activate", authorize("ADMIN"), activateUserController);
router.patch(
  "/:userId/deactivate",
  authorize("ADMIN"),
  deactivateUserController,
);
router.delete("/:userId", authorize("ADMIN"), deleteUserController);

export default router;
