/**
 * Build Filter Query
 * Builds MongoDB query with filters
 */

/**
 * Build query with filters
 * @param {Object} filters - Filter object
 * @param {Array<String>} allowedFields - Allowed filter fields
 * @returns {Object} MongoDB query object
 */
export const buildFilterQuery = (filters, allowedFields = []) => {
  const query = {};

  Object.keys(filters).forEach((key) => {
    if (allowedFields.length === 0 || allowedFields.includes(key)) {
      if (filters[key] !== undefined && filters[key] !== null) {
        query[key] = filters[key];
      }
    }
  });

  return query;
};
