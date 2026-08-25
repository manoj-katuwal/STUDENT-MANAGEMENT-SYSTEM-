import express from "express";
import { successResponse } from "../shared/utils/response/apiResponse.js";
import userRoutes from "../modules/users/user.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import authenticate from "../middleware/authenticate.js";
import authorize from "../middleware/authorize.js";
import studentRoutes from "../modules/students/student.routes.js";
import classRoutes from "../modules/classes/class.route.js";
import sectionRoutes from "../modules/section/section.routes.js";
import academicYearRoutes from "../modules/academicYear/academicYear.routes.js";
import feeStructureRoutes from "../modules/feeStructure/feeStructure.routes.js";
import studentFeeRoutes from "../modules/studentFee/studentFee.routes.js";
import paymentRoutes from "../modules/payment/payment.routes.js";
import receiptRoutes from "../modules/receipt/receipt.routes.js";
import reportsRoutes from "../modules/reports/reports.routes.js";
import discountRoutes from "../modules/discounts/discount.routes.js";
import scholarshipRoutes from "../modules/scholarships/scholarship.routes.js";
import scholarshipAllocationRoutes from "../modules/scholarships/scholarshipAllocation.routes.js";
import finePolicyRoutes from "../modules/fines/finePolicy/finePolicy.routes.js";
import fineRoute from "../modules/fines/fine.routes.js";
import installmentPlanRoutes from "../modules/installment/installmentPlan.routes.js";
import AuditLogRoutes from "../modules/auditLog/auditLog.routes.js";
// import exportRoutes from "../modules/export/export.routes.js";

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
router.use("/users", userRoutes);
router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/classes", classRoutes);
router.use("/sections", sectionRoutes);
router.use("/academic-years", academicYearRoutes);
router.use("/fee-structures", feeStructureRoutes);
router.use("/student-fees", studentFeeRoutes);
router.use("/payments", paymentRoutes);
router.use("/receipts", receiptRoutes);
router.use("/reports", reportsRoutes);
router.use("/discounts", discountRoutes);
router.use("/scholarships", scholarshipRoutes);
router.use("/scholarship-allocations", scholarshipAllocationRoutes);
router.use("/fine-policies", finePolicyRoutes);
router.use("/fines", fineRoute);
router.use("/installment-plans", installmentPlanRoutes);
// router.use("/exports", exportRoutes);
router.use("audit-logs", AuditLogRoutes);

export default router;
