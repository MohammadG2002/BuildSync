import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import dotenv from "dotenv";
import { createServer } from "http";
import { WebSocketServer } from "ws";

// Import configurations
import { connectDB } from "./config/database/index.js";
import { setupWebSocket } from "./websocket/index.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import memberRoutes from "./routes/member.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

// Import middleware
import { errorHandler, notFound, rateLimiter } from "./middleware/index.js";

// Load environment variables
dotenv.config();

const app = express();
let PORT = Number(process.env.PORT) || 5000;

// Create HTTP server
const server = createServer(app);

// Security middleware
// Helmet by default sets Cross-Origin-Resource-Policy: same-origin, which blocks
// loading images from a different origin (e.g., Vite dev server on :5173).
// Keep helmet defaults, but we will override CORP specifically for the uploads route below.
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Rate limiting
app.use(rateLimiter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/upload", uploadRoutes);

// Serve uploaded files
// Allow cross-origin embedding of uploaded assets (images, etc.) so the frontend
// on a different origin/port can render them in <img> tags without being blocked by CORP.
app.use(
  "/uploads",
  express.static("uploads", {
    setHeaders: (res) => {
      // Explicitly relax CORP for static uploads only
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  })
);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Setup WebSocket
const wss = new WebSocketServer({ server });
setupWebSocket(wss);

// Helper: listen with simple port fallback when in use (e.g., 5000 -> 5001 -> 5002)
const listenWithFallback = (srv, initialPort, maxAttempts = 5) => {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    const tryListen = (port) => {
      attempts += 1;

      const onError = (err) => {
        if (err && err.code === "EADDRINUSE" && attempts < maxAttempts) {
          const nextPort = port + 1;
          console.warn(`⚠️  Port ${port} is in use, trying ${nextPort}...`);
          // Remove the error listener before retrying to avoid listener leaks
          srv.removeListener("error", onError);
          tryListen(nextPort);
        } else {
          srv.removeListener("error", onError);
          reject(err);
        }
      };

      srv.once("error", onError);
      srv.listen(port, () => resolve(port));
    };

    tryListen(initialPort);
  });
};

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log("✅ Database connected successfully");

    // Start server
    const boundPort = await listenWithFallback(server, PORT, 10).catch(
      (error) => {
        throw error;
      }
    );
    PORT = boundPort;
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 WebSocket server ready`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    if (boundPort !== Number(process.env.PORT || 5000)) {
      console.warn(
        `🔁 Note: Default port was busy. Running on ${boundPort}. Update your frontend API base URL (VITE_API_URL) if needed.`
      );
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received, shutting down gracefully...");
  server.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

startServer();

export default app;
