/**
 * Message Router
 * Routes incoming messages to appropriate handlers
 */

import { sendToClient } from "../connection/index.js";
import { handlePing } from "./pingHandler.js";
import {
  handleJoinWorkspace,
  handleLeaveWorkspace,
} from "./workspace/index.js";
import { handleJoinProject, handleLeaveProject } from "./project/index.js";
import { handleTyping } from "./typingHandler.js";

/**
 * Route incoming messages to appropriate handlers
 * @param {WebSocket} ws - WebSocket instance
 * @param {Object} message - Parsed message object
 * @param {Object} user - User data
 */
export const handleMessage = async (ws, message, user) => {
  const { type, data } = message;

  try {
    switch (type) {
      case "ping":
        handlePing(ws, data);
        break;

      case "join_workspace":
        handleJoinWorkspace(ws, data);
        break;

      case "leave_workspace":
        handleLeaveWorkspace(ws, data);
        break;

      case "join_project":
        handleJoinProject(ws, data);
        break;

      case "leave_project":
        handleLeaveProject(ws, data);
        break;

      case "typing":
        handleTyping(ws, data);
        break;

      default:
        console.log(`Unknown message type: ${type}`);
        sendToClient(ws, {
          type: "error",
          message: `Unknown message type: ${type}`,
        });
    }
  } catch (error) {
    console.error("Error handling message:", error);
    sendToClient(ws, {
      type: "error",
      message: "Failed to process message",
    });
  }
};
