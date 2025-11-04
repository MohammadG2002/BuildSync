/**
 * Transfer Workspace Ownership
 */

import Workspace from "../../models/Workspace/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

/**
 * Transfer ownership to another member
 * @param {String} workspaceId
 * @param {String} newOwnerUserId
 * @param {String} requesterId
 * @returns {Object} Updated workspace
 */
export const transferWorkspaceOwnership = async (
  workspaceId,
  newOwnerUserId,
  requesterId
) => {
  if (!isValidObjectId(workspaceId) || !isValidObjectId(newOwnerUserId)) {
    throw new Error("Invalid ID");
  }

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // Only current owner can transfer
  if (workspace.owner.toString() !== requesterId.toString()) {
    throw new Error("Only the workspace owner can transfer ownership");
  }

  // Cannot transfer to the same owner
  if (workspace.owner.toString() === newOwnerUserId.toString()) {
    throw new Error("Selected user is already the owner");
  }

  // New owner must be an existing member (admin/member/viewer)
  const newOwnerMemberIndex = workspace.members.findIndex(
    (m) => m.user.toString() === newOwnerUserId.toString()
  );
  if (newOwnerMemberIndex === -1) {
    throw new Error("New owner must be a current workspace member");
  }

  const previousOwnerId = workspace.owner;

  // Set new owner
  workspace.owner = newOwnerUserId;

  // Remove new owner from members array if present
  workspace.members = workspace.members.filter(
    (m) => m.user.toString() !== newOwnerUserId.toString()
  );

  // Ensure previous owner becomes admin in members
  const prevOwnerMemberIndex = workspace.members.findIndex(
    (m) => m.user.toString() === previousOwnerId.toString()
  );
  if (prevOwnerMemberIndex === -1) {
    workspace.members.push({ user: previousOwnerId, role: "admin" });
  } else {
    workspace.members[prevOwnerMemberIndex].role = "admin";
  }

  await workspace.save();

  // Return minimal details (owner and members) - controllers may populate if needed
  return workspace;
};
