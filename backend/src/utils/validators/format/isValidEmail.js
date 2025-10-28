/**
 * Validate Email
 * Validates email format
 */

/**
 * Validate email format
 * @param {String} email - Email to validate
 * @returns {Boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
