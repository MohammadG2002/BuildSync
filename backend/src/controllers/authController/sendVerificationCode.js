/**
 * Send Verification Code Controller
 * @desc    Send email verification code
 * @route   POST /api/auth/send-verification-code
 * @access  Public
 */

import User from "../../models/User/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { sendVerificationEmail } from "../../utils/email/emailService.js";
import crypto from "crypto";

export const sendVerificationCode = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  // Check if email already registered and verified
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser && existingUser.isEmailVerified) {
    return res.status(400).json({
      success: false,
      message: "Email already registered",
    });
  }

  // Generate 6-digit code
  const code = crypto.randomInt(100000, 999999).toString();
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  // Store code temporarily (create or update pending user)
  if (existingUser) {
    existingUser.emailVerificationCode = code;
    existingUser.emailVerificationExpires = expires;
    await existingUser.save();
  } else {
    // Create temporary user record to store verification code
    await User.create({
      email: email.toLowerCase(),
      name: "Pending",
      password: crypto.randomBytes(32).toString("hex"), // Temporary password
      emailVerificationCode: code,
      emailVerificationExpires: expires,
      isActive: false,
    });
  }

  // Send email
  await sendVerificationEmail(email, code);

  sendSuccess(res, 200, "Verification code sent to email", {
    data: { expiresIn: 300 }, // 5 minutes in seconds
  });
});
