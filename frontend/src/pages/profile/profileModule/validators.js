/**
 * Validate profile form data
 * @param {Object} profileData - Profile form data
 * @returns {Object} Validation errors object
 */
export const validateProfile = (profileData) => {
  const errors = {};
  if (!profileData.name.trim()) {
    errors.name = "Name is required";
  }
  if (!profileData.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
    errors.email = "Email is invalid";
  }
  return errors;
};

/**
 * Validate password change form data
 * @param {Object} passwordData - Password form data
 * @returns {Object} Validation errors object
 */
export const validatePassword = (passwordData) => {
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
