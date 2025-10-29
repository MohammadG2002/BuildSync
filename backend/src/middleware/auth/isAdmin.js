/**
 * Admin Authorization Middleware
 * Checks if authenticated user has admin role
 */

import { sendForbidden } from "../../utils/responseHandler/index.js";

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    sendForbidden(res, "Access denied. Admin privileges required.");
  }
};
