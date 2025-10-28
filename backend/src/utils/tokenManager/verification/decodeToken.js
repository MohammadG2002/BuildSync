/**
 * Decode Token
 * Decodes JWT token without verification
 */

import jwt from "jsonwebtoken";

/**
 * Decode token without verification
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};
