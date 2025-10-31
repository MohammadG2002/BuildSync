/**
 * Get User Workspaces
 * Retrieves all workspaces for a user
 */

import Workspace from "../../models/Workspace/index.js";

/**
 * Get all workspaces for a user
 * @param {String} userId - User ID
 * @returns {Array} User's workspaces
 */
export const getUserWorkspaces = async (userId) => {
  const workspaces = await Workspace.find({
    $or: [{ owner: userId }, { "members.user": userId }],
    isActive: true,
  })
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar")
    .populate("projects")
    .sort({ createdAt: -1 });

  return workspaces;
};
