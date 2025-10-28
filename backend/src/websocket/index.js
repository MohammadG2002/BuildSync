/**
 * WebSocket Setup and Configuration
 * Main WebSocket server setup with modular components
 */

import { WebSocketServer } from "ws";
import {
  authenticateConnection,
  addClient,
  removeClient,
  sendWelcomeMessage,
  getOnlineUsersCount,
  isUserOnline,
} from "./connection/index.js";
import { handleMessage } from "./handlers/index.js";

/**
 * Setup WebSocket server
 * @param {Server} server - HTTP server instance
 * @returns {WebSocketServer} WebSocket server instance
 */
export const setupWebSocket = (server) => {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
  });

  wss.on("connection", async (ws, req) => {
    console.log("New WebSocket connection attempt");

    // Authenticate connection
    const user = await authenticateConnection(ws, req);

    if (!user) {
      return; // Connection will be closed by authenticateConnection
    }

    const userId = user._id.toString();

    // Add client to connection pool
    addClient(userId, ws);

    // Send welcome message
    sendWelcomeMessage(ws, user);

    // Store user data on WebSocket instance
    ws.userId = userId;
    ws.userEmail = user.email;

    // Handle incoming messages
    ws.on("message", async (rawMessage) => {
      try {
        const message = JSON.parse(rawMessage.toString());
        console.log(
          `Message from ${user.email}:`,
          message.type || "unknown type"
        );

        await handleMessage(ws, message, user);
      } catch (error) {
        console.error("Error parsing/handling message:", error);
        ws.send(
          JSON.stringify({
            type: "error",
            message: "Invalid message format",
          })
        );
      }
    });

    // Handle client disconnect
    ws.on("close", () => {
      console.log(`User ${user.email} disconnected from WebSocket`);
      removeClient(userId, ws);
    });

    // Handle errors
    ws.on("error", (error) => {
      console.error(`WebSocket error for user ${user.email}:`, error);
    });
  });

  console.log("✅ WebSocket server initialized");

  return wss;
};

// Re-export utility functions for external use
export { getOnlineUsersCount, isUserOnline };

// Re-export broadcasting functions
export * from "./broadcast/index.js";
