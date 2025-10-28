/**
 * Get Client Connections
 * Gets all connections for a specific user
 */

import clients from "../store/clientStore.js";

/**
 * Get all client connections for a user
 * @param {String} userId - User ID
 * @returns {Set<WebSocket>} Set of WebSocket connections
 */
export const getClientConnections = (userId) => {
  return clients.get(userId.toString()) || new Set();
};
