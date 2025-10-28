/**
 * Token Extraction Utilities
 */

/**
 * Extract token from request headers
 * @param {Object} req - Express request object
 * @returns {String|null} Token or null if not found
 */
export const extractToken = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.split(" ")[1];
};
