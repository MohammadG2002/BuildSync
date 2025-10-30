/**
 * Validate password change form data
 * @param {Object} passwordData - Password form data
 * @returns {Object} Validation errors object
 */
const validatePassword = (passwordData) => {
  const errors = {};
  if (!passwordData.currentPassword) {
    errors.currentPassword = "Current password is required";
  }
  if (!passwordData.newPassword) {
    errors.newPassword = "New password is required";
  } else if (passwordData.newPassword.length < 8) {
    errors.newPassword = "Password must be at least 8 characters";
  }
  if (!passwordData.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (passwordData.newPassword !== passwordData.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  return errors;
};

export default validatePassword;
