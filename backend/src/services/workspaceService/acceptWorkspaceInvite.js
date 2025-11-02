/**
 * Accept Workspace Invite
 */

import Workspace from "../../models/Workspace/index.js";
import Notification from "../../models/Notification/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

export const acceptWorkspaceInvite = async (
  workspaceId,
  notificationId,
  userId
) => {
  if (!isValidObjectId(workspaceId) || !isValidObjectId(notificationId)) {
    throw new Error("Invalid IDs");
  }

  const notification = await Notification.findById(notificationId);
  if (!notification) throw new Error("Invite not found");

  if (
    String(notification.recipient) !== String(userId) ||
    notification.type !== "workspace_invite" ||
    notification.status !== "pending" ||
    String(notification.metadata?.workspaceId) !== String(workspaceId)
  ) {
    throw new Error("Invalid invite");
  }

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new Error("Workspace not found");

  if (!workspace.isMember(userId)) {
    workspace.members.push({
      user: userId,
      role: notification.metadata?.role || "member",
    });
    await workspace.save();
  }

  notification.status = "accepted";
  notification.read = true;
  notification.readAt = new Date();
  await notification.save();

  await workspace.populate("members.user", "name email avatar");
  return workspace;
};
