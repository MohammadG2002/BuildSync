/**
 * Update Workspace
 * Updates workspace details
 */

import Workspace from "../../models/Workspace/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

/**
 * Update workspace
 * @param {String} workspaceId - Workspace ID
 * @param {Object} updateData - Data to update
 * @param {String} userId - User ID (for permission check)
 * @returns {Object} Updated workspace
 */
export const updateWorkspace = async (workspaceId, updateData, userId) => {
  if (!isValidObjectId(workspaceId)) {
    throw new Error("Invalid workspace ID");
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // Check if user is owner or admin
  const userRole = workspace.getUserRole(userId);
  if (!["owner", "admin"].includes(userRole)) {
    throw new Error("Only workspace owners and admins can update workspace");
  }

  const { name, description, settings } = updateData;

  if (name) workspace.name = name;
  if (description !== undefined) workspace.description = description;
  if (settings) workspace.settings = { ...workspace.settings, ...settings };

  await workspace.save();
  await workspace.populate("owner", "name email avatar");
  await workspace.populate("members.user", "name email avatar");
  await workspace.populate("projects");

  return workspace;
};
