/**
 * Build Search Query
 * Builds MongoDB text search query
 */

/**
 * Build search query for text fields
 * @param {String} searchTerm - Search term
 * @param {Array<String>} searchFields - Fields to search in
 * @returns {Object} MongoDB $or query
 */
export const buildSearchQuery = (searchTerm, searchFields = []) => {
  if (!searchTerm || searchFields.length === 0) {
    return {};
  }

  const searchRegex = new RegExp(searchTerm, "i");

  return {
    $or: searchFields.map((field) => ({
      [field]: searchRegex,
    })),
  };
};
