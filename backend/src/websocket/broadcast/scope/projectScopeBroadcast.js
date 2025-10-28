/**
 * Project Broadcasting
 * Handles broadcasting to project scope
 */

import { getAllClients, sendToClient } from "../../connection/index.js";

/**
 * Broadcast message to all users in a project
 * @param {String} projectId - Project ID
 * @param {Object} message - Message to broadcast
 * @param {String} excludeUserId - Optional user ID to exclude from broadcast
 */
export const broadcastToProject = (
  projectId,
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
      if (client.projectId === projectId) {
        if (sendToClient(client, message)) {
          sentCount++;
        }
      }
    });
  });

  console.log(`Broadcast to project ${projectId}: ${sentCount} connections`);
};
