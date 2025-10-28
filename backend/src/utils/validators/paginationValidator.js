/**
 * Pagination Validators
 */

/**
 * Validate pagination parameters
 * @param {Number} page - Page number
 * @param {Number} limit - Items per page
 * @returns {Object} Validated page and limit
 */
export const validatePagination = (page, limit) => {
  const validPage = Math.max(1, parseInt(page) || 1);
  const validLimit = Math.min(100, Math.max(1, parseInt(limit) || 10));

  return {
    page: validPage,
    limit: validLimit,
    skip: (validPage - 1) * validLimit,
  };
};
