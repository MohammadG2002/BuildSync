/**
 * Check Token Expiration
 * Checks if JWT token is expired
 */

import { decodeToken } from "./decodeToken.js";

/**
 * Check if token is expired
 * @param {String} token - JWT token
 * @returns {Boolean} True if expired
 */
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
};
