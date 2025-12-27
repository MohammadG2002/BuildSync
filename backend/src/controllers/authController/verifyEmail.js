/**
 * Verify Email Controller
 * @desc    Verify email with confirmation code
 * @route   POST /api/auth/verify-email
 * @access  Public
 */

import User from "../../models/User/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";

export const verifyEmail = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({
      success: false,
      message: "Email and code are required",
    });
  }

  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+emailVerificationCode +emailVerificationExpires");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "No verification request found for this email",
    });
  }

  if (!user.emailVerificationCode || !user.emailVerificationExpires) {
    return res.status(400).json({
      success: false,
      message: "No verification code found. Please request a new one",
    });
  }

  // Check if code expired
  if (new Date() > user.emailVerificationExpires) {
    return res.status(400).json({
      success: false,
      message: "Verification code expired. Please request a new one",
    });
  }

  // Verify code
  if (user.emailVerificationCode !== code) {
    return res.status(400).json({
      success: false,
      message: "Invalid verification code",
    });
  }

  // Mark email as verified
  user.isEmailVerified = true;
  user.emailVerificationCode = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  // Include user status so frontend can decide whether to show "Continue" vs "Create Account"
  const userInfo = {
    isActive: user.isActive,
    name: user.name,
  };

  sendSuccess(res, 200, "Email verified successfully", {
    data: { verified: true, user: userInfo },
  });
});
