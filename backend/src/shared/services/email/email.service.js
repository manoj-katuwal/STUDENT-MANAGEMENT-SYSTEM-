import nodemailer from "nodemailer";

let transporter = null;

const createTransporter = async () => {
  // Try real SMTP first
  if (
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD
  ) {
    const realTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    try {
      await realTransporter.verify();
      console.log(" SMTP connection successful (Gmail)");
      return realTransporter;
    } catch (err) {
      console.warn(" Real SMTP failed:", err.message);
    }
  }

  // Fallback: Ethereal fake SMTP (development only)
  if (process.env.NODE_ENV !== "production") {
    console.warn(" Using Ethereal fake SMTP for development...");
    const testAccount = await nodemailer.createTestAccount();
    const etherealTransporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log(
      " Ethereal SMTP ready. Emails preview at: https://ethereal.email",
    );
    console.log("   User:", testAccount.user);
    console.log("   Pass:", testAccount.pass);
    return etherealTransporter;
  }

  return null;
};

export const sendEmail = async ({ to, subject, html }) => {
  if (!transporter) {
    transporter = await createTransporter();
  }

  if (!transporter) {
    console.error(" No email transporter available");
    return null;
  }

  try {
    const info = await transporter.sendMail({
      from:
        process.env.SMTP_FROM || '"Student Fee System" <noreply@example.com>',
      to,
      subject,
      html,
    });

    console.log(" EMAIL SENT");
    console.log("MESSAGE ID:", info.messageId);
    // Show preview URL for Ethereal emails
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log("Preview email at:", previewUrl);
    }

    return info;
  } catch (error) {
    console.error(" EMAIL SENDING FAILED:", error.message);
    throw error;
  }
};

export const verifyEmailConnection = async () => {
  try {
    transporter = await createTransporter();
    return !!transporter;
  } catch (error) {
    console.warn(
      "SMTP connection failed. Continuing without email service.",
      error.message,
    );
    return false;
  }
};
