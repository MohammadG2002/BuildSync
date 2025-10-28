/**
 * Workspace Broadcasting
 * Handles broadcasting to workspace scope
 */

import { getAllClients, sendToClient } from "../../connection/index.js";

/**
 * Broadcast message to all users in a workspace
 * @param {String} workspaceId - Workspace ID
 * @param {Object} message - Message to broadcast
 * @param {String} excludeUserId - Optional user ID to exclude from broadcast
 */
export const broadcastToWorkspace = (
  workspaceId,
  message,
  excludeUserId = null
) => {
  const clients = getAllClients();
  let sentCount = 0;

  clients.forEach((userClients, userId) => {
    // Skip excluded user
    if (excludeUserId && userId === excludeUserId.toString()) {
      return;
    }

    userClients.forEach((client) => {
      if (client.workspaceId === workspaceId) {
        if (sendToClient(client, message)) {
          sentCount++;
        }
      }
    });
  });

  console.log(
    `Broadcast to workspace ${workspaceId}: ${sentCount} connections`
  );
};
