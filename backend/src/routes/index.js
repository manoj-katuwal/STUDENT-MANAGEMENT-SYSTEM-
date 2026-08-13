import express from "express";
import { successResponse } from "../shared/utils/response/apiResponse.js";

const router = express.Router();

router.get("/health", (req, res) => {
  return successResponse({
    res,
    statusCode: 200,
    message: "Student Fee Management API is healthy",
  });
});

export default router;
