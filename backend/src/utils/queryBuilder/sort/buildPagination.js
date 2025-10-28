/**
 * Build Pagination
 * Builds skip and limit for pagination
 */

/**
 * Build pagination skip and limit
 * @param {Number} page - Page number (1-based)
 * @param {Number} limit - Items per page
 * @returns {Object} Skip and limit values
 */
export const buildPagination = (page = 1, limit = 10) => {
  const validPage = Math.max(1, parseInt(page));
  const validLimit = Math.min(100, Math.max(1, parseInt(limit)));

  return {
    skip: (validPage - 1) * validLimit,
    limit: validLimit,
  };
};
