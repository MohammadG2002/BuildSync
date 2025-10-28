/**
 * Typing Handler
 * Handles typing indicator messages
 */

/**
 * Handle typing indicator
 * @param {WebSocket} ws - WebSocket instance
 * @param {Object} data - Message data
 */
export const handleTyping = (ws, data) => {
  const { workspaceId, isTyping } = data;

  // This would typically broadcast to other users in the workspace
  console.log(
    `User typing in workspace ${workspaceId}: ${
      isTyping ? "started" : "stopped"
    }`
  );
};
