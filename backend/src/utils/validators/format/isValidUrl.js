/**
 * Validate URL
 * Validates URL format
 */

/**
 * Validate URL format
 * @param {String} url - URL to validate
 * @returns {Boolean} True if valid URL
 */
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
