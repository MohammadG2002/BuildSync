/**
 * Merge Queries
 * Merges multiple MongoDB query objects
 */

/**
 * Merge multiple query objects
 * @param {...Object} queries - Query objects to merge
 * @returns {Object} Merged query object
 */
export const mergeQueries = (...queries) => {
  const andConditions = [];

  queries.forEach((query) => {
    if (query && Object.keys(query).length > 0) {
      if (query.$and) {
        andConditions.push(...query.$and);
      } else {
        andConditions.push(query);
      }
    }
  });

  if (andConditions.length === 0) return {};
  if (andConditions.length === 1) return andConditions[0];

  return { $and: andConditions };
};
