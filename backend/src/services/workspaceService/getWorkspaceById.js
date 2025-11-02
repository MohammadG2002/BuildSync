/**
 * Get Workspace By ID
 * Retrieves workspace by ID with additional data
 */

import Workspace from "../../models/Workspace/index.js";
import Notification from "../../models/Notification/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

/**
 * Get workspace by ID
 * @param {String} workspaceId - Workspace ID
 * @param {String} userId - User ID (for access check)
 * @returns {Object} Workspace with additional data
 */
export const getWorkspaceById = async (workspaceId, userId) => {
  if (!isValidObjectId(workspaceId)) {
    throw new Error("Invalid workspace ID");
  }

  const workspace = await Workspace.findById(workspaceId)
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar")
    .populate("projects");

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // Check if user has access: either a member OR has a pending invite
  const isMember = workspace.isMember(userId);
  if (!isMember) {
    const pendingInvite = await Notification.findOne({
      recipient: userId,
      type: "workspace_invite",
      // accept both explicit "pending" and legacy null status as pending
      $or: [{ status: "pending" }, { status: null }],
      "metadata.workspaceId": workspaceId,
    }).lean();
    if (!pendingInvite) {
      throw new Error("Access denied");
    }
  }

  return workspace;
};
