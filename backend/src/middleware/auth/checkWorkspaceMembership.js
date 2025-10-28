/**
 * Workspace Membership Middleware
 * Verifies user is a member of the requested workspace
 */

import {
  sendBadRequest,
  sendNotFound,
  sendForbidden,
  sendServerError,
} from "../../utils/responseHandler.js";

export const checkWorkspaceMembership = async (req, res, next) => {
  try {
    const workspaceId = req.params.workspaceId || req.body.workspace;

    if (!workspaceId) {
      return sendBadRequest(res, "Workspace ID required");
    }

    const Workspace = (await import("../../models/Workspace.js")).default;
    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return sendNotFound(res, "Workspace not found");
    }

    // Check if user is member
    const isMember = workspace.isMember(req.user._id);

    if (!isMember) {
      return sendForbidden(
        res,
        "Access denied. You are not a member of this workspace."
      );
    }

    req.workspace = workspace;
    req.userRole = workspace.getUserRole(req.user._id);
    next();
  } catch (error) {
    console.error("Workspace membership check error:", error);
    sendServerError(res, "Failed to verify workspace membership");
  }
};
