/**
 * Add Workspace Member
 * Adds a member to workspace
 */

import Workspace from "../../models/Workspace/index.js";
import User from "../../models/User/index.js";
import Notification from "../../models/Notification/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

/**
 * Add member to workspace
 * @param {String} workspaceId - Workspace ID
 * @param {Object} memberData - Member data (userId or email, role)
 * @param {String} requesterId - Requester user ID
 * @returns {Object} Updated workspace
 */
export const addWorkspaceMember = async (
  workspaceId,
  memberData,
  requesterId
) => {
  if (!isValidObjectId(workspaceId)) {
    throw new Error("Invalid workspace ID");
  }

  const { userId, email, role = "member" } = memberData;

  // Either userId or email must be provided
  if (!userId && !email) {
    throw new Error("Either userId or email is required");
  }

  const workspace = await Workspace.findById(workspaceId);

  if (!workspace) {
    throw new Error("Workspace not found");
  }

  // Check if requester is owner or admin
  const requesterRole = workspace.getUserRole(requesterId);
  if (!["owner", "admin"].includes(requesterRole)) {
    throw new Error("Only workspace owners and admins can add members");
  }

  // If email is provided, find user by email
  let targetUserId = userId;
  if (email && !userId) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error("No user found with this email address");
    }
    targetUserId = user._id;
  }

  // Check if user is already a member
  if (workspace.isMember(targetUserId)) {
    throw new Error("User is already a member of this workspace");
  }

  workspace.members.push({
    user: targetUserId,
    role,
  });

  await workspace.save();
  await workspace.populate("members.user", "name email avatar");

  // Create notification for the invited user
  const requester = await User.findById(requesterId);
  await Notification.create({
    recipient: targetUserId,
    sender: requesterId,
    type: "workspace_invite",
    title: "Workspace Invitation",
    message: `${requester.name} added you to the workspace "${workspace.name}"`,
    link: `/workspaces/${workspace._id}`,
    metadata: {
      workspaceId: workspace._id,
    },
  });

  return workspace;
};
