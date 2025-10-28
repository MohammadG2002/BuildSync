/**
 * Global Broadcasting
 * Handles broadcasting to all connected clients
 */

import { getAllClients, sendToClient } from "../../connection/index.js";

/**
 * Broadcast message to all connected clients
 * @param {Object} message - Message to broadcast
 */
export const broadcastToAll = (message) => {
  const clients = getAllClients();
  let sentCount = 0;

  clients.forEach((userClients) => {
    userClients.forEach((client) => {
      if (sendToClient(client, message)) {
        sentCount++;
      }
    });
  });

  console.log(`Broadcast to all: ${sentCount} connections`);
};
