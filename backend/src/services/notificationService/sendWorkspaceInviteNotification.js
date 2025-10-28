/**
 * Send Workspace Invite Notification
 * Sends notification for workspace invitation
 */

import { createNotification } from "./createNotification.js";

/**
 * Send workspace invite notification
 * @param {Object} data - Notification data
 * @returns {Object} Created notification
 */
export const sendWorkspaceInviteNotification = async (data) => {
  const { recipientId, senderId, senderName, workspaceName, workspaceId } =
    data;

  return await createNotification({
    recipient: recipientId,
    sender: senderId,
    type: "workspace_invite",
    title: "Workspace Invitation",
    message: `${senderName} added you to the workspace "${workspaceName}"`,
    link: `/workspaces/${workspaceId}`,
    metadata: { workspaceId },
  });
};
