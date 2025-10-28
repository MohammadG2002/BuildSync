/**
 * Leave Workspace Handler
 * Handles workspace leave messages
 */

import { sendToClient } from "../../connection/index.js";

/**
 * Handle leave workspace message
 * @param {WebSocket} ws - WebSocket instance
 * @param {Object} data - Message data
 */
export const handleLeaveWorkspace = (ws, data) => {
  const { workspaceId } = data;
  const previousWorkspace = ws.workspaceId;

  delete ws.workspaceId;

  sendToClient(ws, {
    type: "left_workspace",
    workspaceId: workspaceId || previousWorkspace,
    message: "Left workspace",
  });

  console.log(`Client left workspace: ${previousWorkspace}`);
};
