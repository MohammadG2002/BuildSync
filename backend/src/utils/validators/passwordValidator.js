/**
 * Password Validators
 */

/**
 * Validate password strength
 * @param {String} password - Password to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters long");
  }

  if (password && password.length > 128) {
    errors.push("Password must not exceed 128 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
