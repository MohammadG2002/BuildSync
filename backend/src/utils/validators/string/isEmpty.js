/**
 * Check if Empty
 * Checks if value is empty
 */

/**
 * Check if value is empty
 * @param {*} value - Value to check
 * @returns {Boolean} True if empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
};
