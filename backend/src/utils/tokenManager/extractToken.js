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

  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  // Fallback: allow token via query string for download links
  if (req.query && typeof req.query.token === "string" && req.query.token) {
    return req.query.token;
  }

  return null;
};
