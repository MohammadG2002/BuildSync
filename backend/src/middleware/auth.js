import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please provide a valid token.",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.id).select("-password");

      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: "User not found or inactive",
        });
      }

      // Attach user to request
      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please login again.",
        });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          message: "Invalid token",
        });
      }
      throw error;
    }
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// Check if user is admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }
};

// Check workspace membership
export const checkWorkspaceMembership = async (req, res, next) => {
  try {
    const workspaceId = req.params.workspaceId || req.body.workspace;

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: "Workspace ID required",
      });
    }

    const Workspace = (await import("../models/Workspace.js")).default;
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Check if user is member
    const isMember = workspace.isMember(req.user._id);

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not a member of this workspace.",
      });
    }

    req.workspace = workspace;
    req.userRole = workspace.getUserRole(req.user._id);
    next();
  } catch (error) {
    console.error("Workspace membership check error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify workspace membership",
    });
  }
};
