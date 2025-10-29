/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */

import User from "../../models/User/index.js";
import { verifyToken, extractToken } from "../../utils/tokenManager/index.js";
import {
  sendUnauthorized,
  sendServerError,
} from "../../utils/responseHandler/index.js";

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const token = extractToken(req);

    if (!token) {
      return sendUnauthorized(
        res,
        "Authentication required. Please provide a valid token."
      );
    }

    try {
      // Verify token
      const decoded = verifyToken(token);

      // Get user from token
      const user = await User.findById(decoded.id).select("-password");

      if (!user || !user.isActive) {
        return sendUnauthorized(res, "User not found or inactive");
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      if (error.message === "Token expired") {
        return sendUnauthorized(res, "Token expired. Please login again.");
      }
      if (error.message === "Invalid token") {
        return sendUnauthorized(res, "Invalid token");
      }
      throw error;
    }
  } catch (error) {
    console.error("Authentication error:", error);
    sendServerError(res, "Authentication failed");
  }
};
