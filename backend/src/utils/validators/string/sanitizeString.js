/**
 * Sanitize String
 * Sanitizes string input
 */

/**
 * Sanitize string input
 * @param {String} str - String to sanitize
 * @returns {String} Sanitized string
 */
export const sanitizeString = (str) => {
  if (typeof str !== "string") return str;
  return str.trim().replace(/[<>]/g, "");
};
