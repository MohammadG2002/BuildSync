/**
 * Forgot Password Controller
 * @desc    Send password reset code to email
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */

import User from "../../models/User/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { sendPasswordResetEmail } from "../../utils/email/emailService.js";
import crypto from "crypto";

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  console.log("[ForgotPassword] Request received for email:", email);

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  // Find user by email
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.log("[ForgotPassword] User not found for email:", email);
    // Don't reveal if user exists or not for security
    return sendSuccess(
      res,
      200,
      "If the email exists, a reset code has been sent",
      {}
    );
  }

  // Generate 6-digit reset code
  const resetCode = crypto.randomInt(100000, 999999).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  console.log(
    "[ForgotPassword] Generated reset code:",
    resetCode,
    "for user:",
    user.email
  );

  // Store reset code and expiry
  user.passwordResetToken = resetCode;
  user.passwordResetExpires = expires;
  await user.save();

  // Send email
  try {
    await sendPasswordResetEmail(email, resetCode, user.name);
    console.log("[ForgotPassword] Email sent successfully to:", email);
  } catch (error) {
    console.error("[ForgotPassword] Failed to send email:", error);
    throw error;
  }

  sendSuccess(res, 200, "If the email exists, a reset code has been sent", {
    data: { expiresIn: 600 }, // 10 minutes in seconds
  });
});
