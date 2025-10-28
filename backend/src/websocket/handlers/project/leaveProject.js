/**
 * Leave Project Handler
 * Handles project leave messages
 */

import { sendToClient } from "../../connection/index.js";

/**
 * Handle leave project message
 * @param {WebSocket} ws - WebSocket instance
 * @param {Object} data - Message data
 */
export const handleLeaveProject = (ws, data) => {
  const { projectId } = data;
  const previousProject = ws.projectId;

  delete ws.projectId;

  sendToClient(ws, {
    type: "left_project",
    projectId: projectId || previousProject,
    message: "Left project",
  });

  console.log(`Client left project: ${previousProject}`);
};
