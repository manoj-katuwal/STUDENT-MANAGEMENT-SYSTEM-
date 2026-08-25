import { sendEmail } from "../../shared/services/email/email.service.js";
import NotificationLog from "./notificationLog.model.js";
import { getEmailTemplate } from "./notification.templates.js";
import logger from "../../config/logger.js";

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
