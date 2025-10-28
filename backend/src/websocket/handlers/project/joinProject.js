/**
 * Join Project Handler
 * Handles project join messages
 */

import { sendToClient } from "../../connection/index.js";

/**
 * Handle join project message
 * @param {WebSocket} ws - WebSocket instance
 * @param {Object} data - Message data
 */
export const handleJoinProject = (ws, data) => {
  const { projectId } = data;

  if (!projectId) {
    sendToClient(ws, {
      type: "error",
      message: "Project ID is required",
    });
    return;
  }

  ws.projectId = projectId;

  sendToClient(ws, {
    type: "joined_project",
    projectId,
    message: `Joined project ${projectId}`,
  });

  console.log(`Client joined project: ${projectId}`);
};
