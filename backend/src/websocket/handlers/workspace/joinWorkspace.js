/**
 * Join Workspace Handler
 * Handles workspace join messages
 */

import { sendToClient } from "../../connection/index.js";

/**
 * Handle join workspace message
 * @param {WebSocket} ws - WebSocket instance
 * @param {Object} data - Message data
 */
export const handleJoinWorkspace = (ws, data) => {
  const { workspaceId } = data;

  if (!workspaceId) {
    sendToClient(ws, {
      type: "error",
      message: "Workspace ID is required",
    });
    return;
  }

  ws.workspaceId = workspaceId;

  sendToClient(ws, {
    type: "joined_workspace",
    workspaceId,
    message: `Joined workspace ${workspaceId}`,
  });

  console.log(`Client joined workspace: ${workspaceId}`);
};
