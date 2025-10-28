/**
 * Delete Workspace
 * Soft deletes a workspace
 */

import Workspace from "../../models/Workspace/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

/**
 * Delete (soft delete) workspace
 * @param {String} workspaceId - Workspace ID
 * @param {String} userId - User ID (for permission check)
 * @returns {Boolean} Success status
 */
export const deleteWorkspace = async (workspaceId, userId) => {
  if (!isValidObjectId(workspaceId)) {
    throw new Error("Invalid workspace ID");
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // Check if user is owner
  if (workspace.owner.toString() !== userId.toString()) {
    throw new Error("Only workspace owner can delete workspace");
  }

  // Soft delete
  workspace.isActive = false;
  await workspace.save();

  return true;
};
