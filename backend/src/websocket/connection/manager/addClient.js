/**
 * Add Client
 * Adds a client connection to the store
 */

import clients from "../store/clientStore.js";

/**
 * Add client connection
 * @param {String} userId - User ID
 * @param {WebSocket} ws - WebSocket instance
 */
export const addClient = (userId, ws) => {
  const userIdStr = userId.toString();

  if (!clients.has(userIdStr)) {
    clients.set(userIdStr, new Set());
  }

  clients.get(userIdStr).add(ws);
  console.log(
    `User ${userIdStr} connected. Total connections: ${clients.size}`
  );
};
