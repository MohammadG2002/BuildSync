/**
 * Check Workspace Membership
 * Checks if user is member of workspace
 */

import Workspace from "../../models/Workspace/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

/**
 * Check if user is member of workspace
 * @param {String} workspaceId - Workspace ID
 * @param {String} userId - User ID
 * @returns {Object} Membership info
 */
export const checkWorkspaceMembership = async (workspaceId, userId) => {
  if (!isValidObjectId(workspaceId)) {
    throw new Error("Invalid workspace ID");
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  const isMember = workspace.isMember(userId);
  const role = workspace.getUserRole(userId);

  return {
    isMember,
    role,
    workspace,
  };
};
