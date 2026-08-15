import express from "express";
import { successResponse } from "../shared/utils/response/apiResponse.js";
import userRoutes from "../modules/users/user.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";

const router = express.Router();

router.get("/health", (req, res) => {
  return successResponse({
    res,
    statusCode: 200,
    message: "Student Fee Management API is healthy",
  });
});
router.get("/admin-test", authenticate, authorize("ADMIN"), (req, res) => {
  return successResponse({
    res,
    statusCode: 200,
    message: "Admin authorization successful",
    data: {
      user: req.user,
    },
  });
});
router.use('/users', userRoutes);
router.use("/auth", authRoutes);



export default router;
