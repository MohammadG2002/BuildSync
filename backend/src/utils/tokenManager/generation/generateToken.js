/**
 * Generate Token
 * Generates JWT token for user
 */

import jwt from "jsonwebtoken";

/**
 * Generate JWT token for user
 * @param {String} userId - User ID
 * @param {Object} options - Additional token options
 * @returns {String} JWT token
 */
export const generateToken = (userId, options = {}) => {
  const expiresIn = options.expiresIn || process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn,
    ...options,
  });
};
