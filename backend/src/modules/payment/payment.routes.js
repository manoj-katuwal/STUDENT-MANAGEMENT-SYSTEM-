import express from "express";
import { createOfflinePayment } from "./payment.controller.js";

const router = express.Router();
router.post("/", createOfflinePayment);

export default router;
