import { sendEmail } from "../../shared/services/email/email.service.js";
import NotificationLog from "./notificationLog.model.js";
import { getEmailTemplate } from "./notification.templates.js";
import logger from "../../config/logger.js";
import Student from "../students/student.model.js";
import {
  getOverdueStudentFees,
  getUpcomingDueStudentFees,
} from "../studentFee/studentFee.repository.js";

const RECURRING_EVENTS = ["FEE_DUE_REMINDER", "INSTALLMENT_OVERDUE"];

const wasAlreadySent = async (entityType, entityId, eventType) => {
  const query = { entityType, entityId, eventType, status: "SENT" };

  if (RECURRING_EVENTS.includes(eventType)) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    query.createdAt = { $gte: startOfToday };
  }

  const existing = await NotificationLog.findOne(query);
  return !!existing;
};

export const sendNotification = async ({
  entityType,
  entityId,
  eventType,
  recipientEmail,
  templateData,
}) => {
  try {
    const alreadySent = await wasAlreadySent(entityType, entityId, eventType);
    if (alreadySent) {
      return;
    }

    const { subject, html } = getEmailTemplate(eventType, templateData);

    const result = await sendEmail({ to: recipientEmail, subject, html });
    if (!result) {
      throw new Error("Email transporter is unavailable");
    }

    await NotificationLog.create({
      entityType,
      entityId,
      eventType,
      recipientEmail,
      status: "SENT",
    });
  } catch (err) {
    logger.error("Notification send failed", {
      entityType,
      entityId,
      eventType,
      err,
    });
    await NotificationLog.create({
      entityType,
      entityId,
      eventType,
      recipientEmail,
      status: "FAILED",
    }).catch(() => {});
  }
};

export const checkAndSendFeeReminders = async () => {
  // १. आउँदो ३ दिनभित्र due हुने fees — FEE_DUE_REMINDER
  const upcomingFees = await getUpcomingDueStudentFees(3); // 3 दिन भित्र due
  for (const fee of upcomingFees) {
    const student = await Student.findById(fee.studentId).select("name email");
    if (!student || !student.email) continue; // skip if student missing or no email

    await sendNotification({
      entityType: "StudentFee",
      entityId: fee._id,
      eventType: "FEE_DUE_REMINDER",
      recipientEmail: student.email,
      templateData: {
        studentName: student.name,
        dueAmount: fee.dueAmount,
        dueDate: fee.dueDate?.toISOString().split("T")[0],
      },
    });
  }

  // २. पहिले नै overdue भइसकेका (dueDate बितिसकेको, dueAmount > 0) — INSTALLMENT_OVERDUE
  //    (नाम "Installment" भए पनि, यो सामान्य overdue StudentFee माथि लागू हुन्छ,
  //     installment मात्र होइन — नामकरण तिम्रो backlog अनुसार राखेको हुँ)
  const overdueFees = await getOverdueStudentFees(); // Fine module मा पहिले नै बनेको function
  for (const fee of overdueFees) {
    const student = await Student.findById(fee.studentId).select("name email");
    if (!student || !student.email) continue; // skip if student missing or no email

    await sendNotification({
      entityType: "StudentFee",
      entityId: fee._id,
      eventType: "INSTALLMENT_OVERDUE",
      recipientEmail: student.email,
      templateData: {
        studentName: student.name,
        dueAmount: fee.dueAmount,
        dueDate: fee.dueDate?.toISOString().split("T")[0],
      },
    });
  }
};
