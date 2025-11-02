/**
 * Create Workspace Invite
 * Creates a pending invite notification for a user to join a workspace
 */

import Workspace from "../../models/Workspace/index.js";
import User from "../../models/User/index.js";
import Notification from "../../models/Notification/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

export const createWorkspaceInvite = async (
  workspaceId,
  inviteData,
  requesterId
) => {
  if (!isValidObjectId(workspaceId)) {
    throw new Error("Invalid workspace ID");
  }

  const { userId, email, role = "member" } = inviteData;

  if (!userId && !email) {
    throw new Error("Either userId or email is required");
  }

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // Check permissions
  const requesterRole = workspace.getUserRole(requesterId);
  if (!["owner", "admin"].includes(requesterRole)) {
    throw new Error("Only workspace owners and admins can invite members");
  }

  // Resolve recipient
  let targetUserId = userId;
  let targetUser = null;
  if (email && !userId) {
    targetUser = await User.findOne({ email: email.toLowerCase() });
    if (!targetUser) {
      throw new Error("No user found with this email address");
    }
    targetUserId = targetUser._id;
  } else {
    targetUser = await User.findById(targetUserId);
  }

  // Already a member?
  if (workspace.isMember(targetUserId)) {
    throw new Error("User is already a member of this workspace");
  }

  const requester = await User.findById(requesterId);

  // Create pending invite notification
  const notification = await Notification.create({
    recipient: targetUserId,
    sender: requesterId,
    type: "workspace_invite",
    title: "Workspace Invitation",
    message: `${requester.name} invited you to join the workspace "${workspace.name}"`,
    link: null,
    metadata: {
      workspaceId: workspace._id,
      role,
    },
    status: "pending",
  });

  return notification;
};
