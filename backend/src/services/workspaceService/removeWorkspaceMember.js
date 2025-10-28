/**
 * Remove Workspace Member
 * Removes a member from workspace
 */

import Workspace from "../../models/Workspace/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

/**
 * Remove member from workspace
 * @param {String} workspaceId - Workspace ID
 * @param {String} memberUserId - User ID to remove
 * @param {String} requesterId - Requester user ID
 * @returns {Boolean} Success status
 */
export const removeWorkspaceMember = async (
  workspaceId,
  memberUserId,
  requesterId
) => {
  if (!isValidObjectId(workspaceId) || !isValidObjectId(memberUserId)) {
    throw new Error("Invalid ID");
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // Check if requester is owner or admin
  const requesterRole = workspace.getUserRole(requesterId);
  if (!["owner", "admin"].includes(requesterRole)) {
    throw new Error("Only workspace owners and admins can remove members");
  }

  // Cannot remove owner
  if (workspace.owner.toString() === memberUserId) {
    throw new Error("Cannot remove workspace owner");
  }

  workspace.members = workspace.members.filter(
    (member) => member.user.toString() !== memberUserId
  );

  await workspace.save();

  return true;
};
