/**
 * Verify Token
 * Verifies and decodes JWT token
 */

import jwt from "jsonwebtoken";

/**
 * Verify and decode JWT token
 * @param {String} token - JWT token
 * @returns {Object} Decoded token payload
 * @throws {Error} If token is invalid or expired
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw error;
  }
};
