/**
 * Ping Handler
 * Handles ping/pong messages
 */

import { sendToClient } from "../connection/index.js";

/**
 * Handle ping message
 * @param {WebSocket} ws - WebSocket instance
 * @param {Object} data - Message data
 */
export const handlePing = (ws, data) => {
  sendToClient(ws, { type: "pong" });
};
