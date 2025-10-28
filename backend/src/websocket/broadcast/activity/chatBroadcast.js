/**
 * Chat Message Broadcasting
 * Handles broadcasting chat messages
 */

import { broadcastToWorkspace } from "../scope/workspaceScopeBroadcast.js";

/**
 * Send chat message to workspace
 * @param {String} workspaceId - Workspace ID
 * @param {Object} chatMessage - Chat message data
 * @param {String} senderId - Sender user ID
 */
export const broadcastChatMessage = (workspaceId, chatMessage, senderId) => {
  const message = {
    type: "chat_message",
    data: chatMessage,
  };

  broadcastToWorkspace(workspaceId, message, senderId);
};
