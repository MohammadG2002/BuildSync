/**
 * Email Service
 * Handles sending emails via SMTP
 */

import nodemailer from "nodemailer";

let transporter = null;

// Initialize email transporter
const getTransporter = () => {
  // Always recreate transporter to get latest env vars
  const emailConfig = {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  // If SMTP credentials not configured, use test account for development
  if (
    !process.env.SMTP_USER ||
    process.env.SMTP_USER === "your-email@gmail.com"
  ) {
    console.warn(
      "[Email] SMTP not configured. Emails will be logged to console only."
    );
    return null;
  }

  transporter = nodemailer.default
    ? nodemailer.default.createTransport(emailConfig)
    : nodemailer.createTransport(emailConfig);
  return transporter;
};

/**
 * Send verification code email
 * @param {String} email - Recipient email
 * @param {String} code - Verification code
 */
export const sendVerificationEmail = async (email, code) => {
  const transport = getTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@buildsync.com",
    to: email,
    subject: "BuildSync - Email Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Welcome to BuildSync!</h2>
        <p>Please use the following code to verify your email address:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="color: #3b82f6; letter-spacing: 8px; margin: 0; font-size: 36px;">${code}</h1>
        </div>
        <p style="color: #6b7280;">This code will expire in 5 minutes.</p>
        <p style="color: #6b7280;">If you didn't request this code, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px;">BuildSync - Project Management Made Simple</p>
      </div>
    `,
  };

  if (!transport) {
    // Log to console if SMTP not configured
    console.log("=".repeat(60));
    console.log("[Email] Verification Code (DEVELOPMENT MODE)");
    console.log("To:", email);
    console.log("Code:", code);
    console.log("Expires: 5 minutes");
    console.log("=".repeat(60));
    return { success: true, dev: true };
  }

  try {
    await transport.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("[Email] Failed to send verification email:", error);
    throw new Error("Failed to send verification email");
  }
};

/**
 * Send password reset code email
 * @param {String} email - Recipient email
 * @param {String} code - Reset code
 * @param {String} name - User name
 */
export const sendPasswordResetEmail = async (email, code, name) => {
  const transport = getTransporter();

  const mailOptions = {
    from: process.env.EMAIL_FROM || "noreply@buildsync.com",
    to: email,
    subject: "BuildSync - Password Reset Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #3b82f6;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Please use the following code:</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
          <h1 style="color: #3b82f6; letter-spacing: 8px; margin: 0; font-size: 36px;">${code}</h1>
        </div>
        <p style="color: #6b7280;">This code will expire in 10 minutes.</p>
        <p style="color: #dc2626; font-weight: 500;">If you didn't request this password reset, please ignore this email and ensure your account is secure.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        <p style="color: #9ca3af; font-size: 12px;">BuildSync - Project Management Made Simple</p>
      </div>
    `,
  };

  if (!transport) {
    // Log to console if SMTP not configured
    console.log("=".repeat(60));
    console.log("[Email] Password Reset Code (DEVELOPMENT MODE)");
    console.log("To:", email);
    console.log("Name:", name);
    console.log("Code:", code);
    console.log("Expires: 10 minutes");
    console.log("=".repeat(60));
    return { success: true, dev: true };
  }

  try {
    await transport.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("[Email] Failed to send password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

export default {
  sendVerificationEmail,
  sendPasswordResetEmail,
};
