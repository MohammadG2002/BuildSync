/**
 * Send to Client
 * Sends a message to a specific WebSocket client
 */

/**
 * Send message to specific client
 * @param {WebSocket} ws - WebSocket instance
 * @param {Object} data - Data to send
 * @returns {Boolean} True if sent successfully
 */
export const sendToClient = (ws, data) => {
  if (ws.readyState === 1) {
    // WebSocket.OPEN
    try {
      ws.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error("Error sending message to client:", error);
      return false;
    }
  }
  return false;
};
