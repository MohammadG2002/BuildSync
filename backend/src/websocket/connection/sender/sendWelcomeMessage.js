/**
 * Send Welcome Message
 * Sends a welcome message to newly connected client
 */

import { sendToClient } from "./sendToClient.js";

/**
 * Send welcome message to newly connected client
 * @param {WebSocket} ws - WebSocket instance
 * @param {Object} user - User data
 */
export const sendWelcomeMessage = (ws, user) => {
  sendToClient(ws, {
    type: "connection",
    message: "Connected to BuildSync WebSocket",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};
