/**
 * WebSocket Authentication
 * Handles WebSocket connection authentication
 */

import jwt from "jsonwebtoken";
import User from "../../models/User/index.js";

/**
 * Authenticate WebSocket connection
 * @param {WebSocket} ws - WebSocket instance
 * @param {Request} req - HTTP request
 * @returns {Object} User data or null
 */
export const authenticateConnection = async (ws, req) => {
  try {
    // Extract token from query string or headers
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token =
      url.searchParams.get("token") ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      ws.close(1008, "No authentication token provided");
      return null;
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      ws.close(1008, "User not found");
      return null;
    }

    return user;
  } catch (error) {
    console.error("WebSocket authentication error:", error);
    ws.close(1008, "Authentication failed");
    return null;
  }
};
