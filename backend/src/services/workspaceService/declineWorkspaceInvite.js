/**
 * Decline Workspace Invite
 */

import Notification from "../../models/Notification/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

export const declineWorkspaceInvite = async (
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

  notification.status = "declined";
  notification.read = true;
  notification.readAt = new Date();
  await notification.save();

  return { success: true };
};
