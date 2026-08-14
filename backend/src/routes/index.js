import express from "express";
import { successResponse } from "../shared/utils/response/apiResponse.js";
import userRoutes from "../modules/users/user.routes.js";
import { getMe } from "../modules/users/user.controller.js";
import authenticate from "../middleware/authenticate.js";

const router = express.Router();

router.get("/health", (req, res) => {
  return successResponse({
    res,
    statusCode: 200,
    message: "Student Fee Management API is healthy",
  });
});

router.get("/me", authenticate, getMe);
router.use("/users", userRoutes );

export default router;
