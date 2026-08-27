import express from "express";
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import { getAllLogs, getEntityLogs } from "./auditLog.controller.js";

const router = express.Router();

router.get("/", authenticate, authorize("ADMIN"), getAllLogs);

router.get(
  "/:entityType/:entityId",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  getEntityLogs,
);

export default router;
