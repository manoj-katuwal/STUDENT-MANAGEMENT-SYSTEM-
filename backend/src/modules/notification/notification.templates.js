export const getEmailTemplate = (eventType, data) => {
  switch (eventType) {
    case "PAYMENT_RECEIVED":
      return {
        subject: `Payment Received - ${data.studentName}`,
        html: `<p>Dear ${data.studentName},</p>
               <p>We have received your payment of <b>${data.amount}</b> on ${data.date}.</p>
               <p>Thank you.</p>`,
      };
    case "PAYMENT_REVERSED":
      return {
        subject: `Payment Reversed - ${data.studentName}`,
        html: `<p>Dear ${data.studentName},</p>
               <p>Your payment of <b>${data.amount}</b> has been reversed. Reason: ${data.reason}</p>`,
      };
    case "FINE_IMPOSED":
      return {
        subject: `Late Fee Applied - ${data.studentName}`,
        html: `<p>Dear ${data.studentName},</p>
               <p>A late fee of <b>${data.amount}</b> has been applied due to ${data.overdueDays} overdue day(s).</p>`,
      };
    case "FEE_DUE_REMINDER":
      return {
        subject: `Fee Due Reminder - ${data.studentName}`,
        html: `<p>Dear ${data.studentName},</p>
               <p>Your fee of <b>${data.dueAmount}</b> is due on ${data.dueDate}. Please pay before the due date.</p>`,
      };
    case "INSTALLMENT_OVERDUE":
      return {
        subject: `Installment Overdue - ${data.studentName}`,
        html: `<p>Dear ${data.studentName},</p>
               <p>Your installment of <b>${data.dueAmount}</b> was due on ${data.dueDate} and is now overdue.</p>`,
      };
    default:
      throw new Error(`Unknown notification event type: ${eventType}`);
  }
};
