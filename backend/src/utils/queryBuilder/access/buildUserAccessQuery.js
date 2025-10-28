/**
 * Build User Access Query
 * Builds MongoDB query for user access check
 */

/**
 * Build user access query (owner or member)
 * @param {String} userId - User ID
 * @param {Object} options - Additional options
 * @returns {Object} MongoDB $or query for access check
 */
export const buildUserAccessQuery = (userId, options = {}) => {
  const ownerField = options.ownerField || "owner";
  const memberField = options.memberField || "members.user";

  return {
    $or: [{ [ownerField]: userId }, { [memberField]: userId }],
  };
};
