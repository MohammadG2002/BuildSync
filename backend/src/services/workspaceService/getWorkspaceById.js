/**
 * Get Workspace By ID
 * Retrieves workspace by ID with additional data
 */

import Workspace from "../../models/Workspace/index.js";
import Project from "../../models/Project/index.js";
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
    .populate("members.user", "name email avatar");

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // Check if user has access
  const isMember = workspace.isMember(userId);
  if (!isMember) {
    throw new Error("Access denied");
  }

  // Get projects count
  const projectsCount = await Project.countDocuments({
    workspace: workspace._id,
    isArchived: false,
  });

  return {
    ...workspace.toObject(),
    projectsCount,
  };
};
