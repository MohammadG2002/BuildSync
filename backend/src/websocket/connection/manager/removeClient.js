/**
 * Remove Client
 * Removes a client connection from the store
 */

import clients from "../store/clientStore.js";

/**
 * Remove client connection
 * @param {String} userId - User ID
 * @param {WebSocket} ws - WebSocket instance
 */
export const removeClient = (userId, ws) => {
  const userIdStr = userId.toString();
  const userClients = clients.get(userIdStr);

  if (userClients) {
    userClients.delete(ws);

    if (userClients.size === 0) {
      clients.delete(userIdStr);
    }

    console.log(
      `User ${userIdStr} disconnected. Total connections: ${clients.size}`
    );
  }
};
