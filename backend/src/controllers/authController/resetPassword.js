/**
 * Reset Password Controller
 * @desc    Reset password using code
 * @route   POST /api/auth/reset-password
 * @access  Public
 */

import User from "../../models/User/index.js";
import { asyncHandler } from "../../utils/asyncHandler/index.js";
import { sendSuccess } from "../../utils/responseHandler/index.js";
import { validatePassword } from "../../utils/validators/index.js";

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Email, code, and new password are required",
    });
  }

  // Validate password strength
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    return res.status(400).json({
      success: false,
      message: passwordValidation.errors.join(", "),
    });
  }

  // Find user with valid reset token
  const user = await User.findOne({
    email: email.toLowerCase(),
    passwordResetToken: code,
    passwordResetExpires: { $gt: Date.now() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired reset code",
    });
  }

  // Update password and clear reset token
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendSuccess(res, 200, "Password has been reset successfully");
});
