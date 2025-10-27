import { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Store connected clients
const clients = new Map();

export const setupWebSocket = (server) => {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
  });

  wss.on("connection", async (ws, req) => {
    console.log("New WebSocket connection attempt");

    // Extract token from query string or headers
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token =
      url.searchParams.get("token") ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      ws.close(1008, "No authentication token provided");
      return;
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        ws.close(1008, "User not found");
        return;
      }

      // Store client connection
      const userId = user._id.toString();
      if (!clients.has(userId)) {
        clients.set(userId, new Set());
      }
      clients.get(userId).add(ws);

      console.log(`User ${user.email} connected via WebSocket`);

      // Send welcome message
      ws.send(
        JSON.stringify({
          type: "connection",
          message: "Connected to BuildSync WebSocket",
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
          },
        })
      );

      // Handle incoming messages
      ws.on("message", async (message) => {
        try {
          const data = JSON.parse(message.toString());
          console.log("Received message:", data);

          // Handle different message types
          switch (data.type) {
            case "ping":
              ws.send(JSON.stringify({ type: "pong" }));
              break;

            case "join_workspace":
              // Join a workspace room (for future room-based messaging)
              ws.workspaceId = data.workspaceId;
              break;

            case "leave_workspace":
              delete ws.workspaceId;
              break;

            default:
              console.log("Unknown message type:", data.type);
          }
        } catch (error) {
          console.error("Error handling message:", error);
        }
      });

      // Handle client disconnect
      ws.on("close", () => {
        console.log(`User ${user.email} disconnected from WebSocket`);
        const userClients = clients.get(userId);
        if (userClients) {
          userClients.delete(ws);
          if (userClients.size === 0) {
            clients.delete(userId);
          }
        }
      });

      // Handle errors
      ws.on("error", (error) => {
        console.error("WebSocket error:", error);
      });
    } catch (error) {
      console.error("WebSocket authentication error:", error);
      ws.close(1008, "Authentication failed");
    }
  });

  console.log("WebSocket server initialized");

  return wss;
};

// Send notification to specific user
export const sendNotificationToUser = (userId, notification) => {
  const userClients = clients.get(userId.toString());
  if (userClients) {
    const message = JSON.stringify({
      type: "notification",
      data: notification,
    });

    userClients.forEach((client) => {
      if (client.readyState === 1) {
        // WebSocket.OPEN
        client.send(message);
      }
    });
  }
};

// Broadcast message to all users in a workspace
export const broadcastToWorkspace = (
  workspaceId,
  message,
  excludeUserId = null
) => {
  const messageStr = JSON.stringify(message);

  clients.forEach((userClients, userId) => {
    if (excludeUserId && userId === excludeUserId.toString()) {
      return;
    }

    userClients.forEach((client) => {
      if (client.workspaceId === workspaceId && client.readyState === 1) {
        client.send(messageStr);
      }
    });
  });
};

// Broadcast message to all connected clients
export const broadcastToAll = (message) => {
  const messageStr = JSON.stringify(message);

  clients.forEach((userClients) => {
    userClients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(messageStr);
      }
    });
  });
};

// Get online users count
export const getOnlineUsersCount = () => {
  return clients.size;
};

// Check if user is online
export const isUserOnline = (userId) => {
  return clients.has(userId.toString());
};
