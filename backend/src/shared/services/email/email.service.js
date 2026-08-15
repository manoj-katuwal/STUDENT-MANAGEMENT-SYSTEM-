import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });

    console.log("✅ EMAIL SENT");
    console.log("MESSAGE ID:", info.messageId);
    console.log("ACCEPTED:", info.accepted);
    console.log("REJECTED:", info.rejected);

    return info;
  } catch (error) {
    console.error("❌ EMAIL SENDING FAILED");
    console.error(error);

    throw error;
  }
};

export const verifyEmailConnection = async () => {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASSWORD
  ) {
    console.warn(
      "SMTP credentials not configured. Skipping email verification.",
    );
    return false;
  }

  try {
    await transporter.verify();
    console.log("SMTP connection successful");
    return true;
  } catch (error) {
    console.warn(
      "SMTP connection failed. Continuing without email service.",
      error.message,
    );
    return false;
  }
};
