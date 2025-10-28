/**
 * Change User Password
 * Handles password change for user
 */

import User from "../../models/User/index.js";
import {
  validateRequiredFields,
  validatePassword,
} from "../../utils/validators/index.js";

/**
 * Change user password
 * @param {String} userId - User ID
 * @param {Object} passwordData - Current and new password
 * @returns {Boolean} Success status
 */
export const changeUserPassword = async (userId, passwordData) => {
  const { currentPassword, newPassword } = passwordData;

  // Validate required fields
  const validation = validateRequiredFields(passwordData, [
    "currentPassword",
    "newPassword",
  ]);
  if (!validation.isValid) {
    throw new Error(validation.errors.join(", "));
  }

  // Validate new password strength
  const passwordValidation = validatePassword(newPassword);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.errors.join(", "));
  }

  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  // Verify current password
  const isPasswordValid = await user.comparePassword(currentPassword);
  if (!isPasswordValid) {
    throw new Error("Current password is incorrect");
  }

  // Update password
  user.password = newPassword;
  await user.save();

  return true;
};
