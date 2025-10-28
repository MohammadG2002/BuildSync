/**
 * Build Sort Query
 * Builds MongoDB sort object
 */

/**
 * Build sort object from query string
 * @param {String} sortString - Sort string (e.g., "-createdAt,name")
 * @param {Object} defaultSort - Default sort object
 * @returns {Object} MongoDB sort object
 */
export const buildSortQuery = (sortString, defaultSort = { createdAt: -1 }) => {
  if (!sortString) {
    return defaultSort;
  }

  const sort = {};
  const fields = sortString.split(",");

  fields.forEach((field) => {
    if (field.startsWith("-")) {
      sort[field.substring(1)] = -1;
    } else {
      sort[field] = 1;
    }
  });

  return Object.keys(sort).length > 0 ? sort : defaultSort;
};
