import express from "express"
import authenticate from "../../middleware/authenticate.js";
import authorize from "../../middleware/authorize.js";
import { exportFeeCollection } from "./export.controller.js";

const router = express.Router();

router.get(
  "/fee-collection",
  authenticate,
  authorize("ADMIN", "ACCOUNTANT", "PRINCIPAL"),
  exportFeeCollection,
);


export default router;
