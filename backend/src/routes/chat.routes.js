import express from "express";
import {
  getMessages,
  sendMessage,
  updateMessage,
  deleteMessage,
  markAsRead,
  getDirectMessages,
  sendDirectMessage,
  markDirectRead,
} from "../controllers/chatController/index.js";
import {
  authenticate,
  mongoIdValidation,
  validate,
} from "../middleware/index.js";
import fetch from "node-fetch";
import mongoose from "mongoose";
import AIChatLog from "../models/AIChatLog.js";

const router = express.Router();

// Get chat logs for a session
router.get("/logs/:sessionId", authenticate, async (req, res) => {
  const { sessionId } = req.params;
  const { limit = 50, skip = 0 } = req.query;
  const userId = req.user._id;

  try {
    // Only show logs that belong to this user (with userId set)
    const logs = await AIChatLog.find({
      sessionId,
      userId: userId,
    })
      .sort({ timestamp: 1 })
      .skip(Number(skip))
      .limit(Number(limit));
    res.json({ sessionId, logs });
  } catch (err) {
    console.error("[API/chat] Logs error:", err);
    res.status(500).json({ error: "Failed to fetch chat logs" });
  }
});

// List all sessions for a user (or all sessions if no user)
router.get("/sessions", authenticate, async (req, res) => {
  const userId = req.user._id;
  try {
    const sessions = await AIChatLog.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      { $group: { _id: "$sessionId", lastMsg: { $max: "$timestamp" } } },
      { $sort: { lastMsg: -1 } },
      { $limit: 100 },
    ]);
    res.json({ sessions });
  } catch (err) {
    console.error("[API/chat] Sessions error:", err);
    res.status(500).json({ error: "Failed to list sessions" });
  }
});

// Proxy chat to n8n webhook (requires authentication)
router.post("/", authenticate, async (req, res) => {
  const { message, sessionId } = req.body;
  const userId = req.user._id;

  console.log("[API/chat] Incoming:", { message, sessionId, userId });
  try {
    // Log user message
    await AIChatLog.create({
      sessionId,
      userId,
      role: "user",
      content: message,
    });

    const response = await fetch(
      "https://buildsync2.app.n8n.cloud/webhook/8b085178-cf54-4bfe-812d-0e0d562ce3ac/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "sendMessage",
          sessionId: sessionId || `user-${Date.now()}`,
          chatInput: message,
        }),
      }
    );
    console.log("[API/chat] n8n status:", response.status);
    let data = {};
    try {
      data = await response.json();
      console.log("[API/chat] n8n response:", data);
    } catch (jsonErr) {
      console.error("[API/chat] Failed to parse n8n response as JSON", jsonErr);
    }
    // Log assistant message
    if (data.output) {
      await AIChatLog.create({
        sessionId,
        userId,
        role: "assistant",
        content: data.output,
      });
    }
    res.json({ reply: data.output || null, n8n: data });
  } catch (error) {
    console.error("[API/chat] Proxy error:", error);
    res.status(500).json({ error: "AI service unavailable" });
  }
});

// All other chat routes require authentication
router.use(authenticate);

router
  .route("/:workspaceId")
  .get(mongoIdValidation("workspaceId"), validate, getMessages)
  .post(mongoIdValidation("workspaceId"), validate, sendMessage);

router
  .route("/:workspaceId/:messageId")
  .put(
    mongoIdValidation("workspaceId"),
    mongoIdValidation("messageId"),
    validate,
    updateMessage
  )
  .delete(
    mongoIdValidation("workspaceId"),
    mongoIdValidation("messageId"),
    validate,
    deleteMessage
  );

router
  .route(":/workspaceId/:messageId/read")
  .put(
    mongoIdValidation("workspaceId"),
    mongoIdValidation("messageId"),
    validate,
    markAsRead
  );

// Direct messages within a workspace
router
  .route("/:workspaceId/dm/:userId")
  .get(
    mongoIdValidation("workspaceId"),
    mongoIdValidation("userId"),
    validate,
    getDirectMessages
  )
  .post(
    mongoIdValidation("workspaceId"),
    mongoIdValidation("userId"),
    validate,
    sendDirectMessage
  );

// Global direct messages (not tied to a workspace)
router
  .route("/dm/:userId")
  .get(mongoIdValidation("userId"), validate, getDirectMessages)
  .post(mongoIdValidation("userId"), validate, sendDirectMessage);

// Mark global DM conversation as read
router.put(
  "/dm/:userId/read",
  mongoIdValidation("userId"),
  validate,
  markDirectRead
);

export default router;
