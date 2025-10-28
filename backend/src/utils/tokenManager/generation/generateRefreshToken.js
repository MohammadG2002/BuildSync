/**
 * Generate Refresh Token
 * Generates refresh token for user
 */

import { generateToken } from "./generateToken.js";

/**
 * Generate refresh token
 * @param {String} userId - User ID
 * @returns {String} Refresh token
 */
export const generateRefreshToken = (userId) => {
  return generateToken(userId, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  });
};
