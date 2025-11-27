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

    // Fetch comprehensive user context to send to n8n
    const User = (await import("../models/User/index.js")).default;
    const Workspace = (await import("../models/Workspace/index.js")).default;
    const Project = (await import("../models/Project/index.js")).default;
    const Task = (await import("../models/Task/index.js")).default;

    // Get user profile
    const user = await User.findById(userId).select("-password -__v").lean();

    // Get user's workspaces with their roles
    const workspaces = await Workspace.find({
      "members.user": userId,
    })
      .select("_id name description settings members createdAt updatedAt")
      .lean();

    // Build workspace context with user roles
    const workspaceContext = workspaces.map((ws) => {
      const memberInfo = ws.members.find(
        (m) => m.user.toString() === userId.toString()
      );
      return {
        id: ws._id,
        name: ws.name,
        description: ws.description,
        settings: ws.settings,
        userRole: memberInfo?.role || "member",
        joinedAt: memberInfo?.joinedAt,
        createdAt: ws.createdAt,
        members: ws.members.map((m) => ({
          user: m.user,
          role: m.role,
          joinedAt: m.joinedAt,
        })),
      };
    });

    // Get user's projects (only projects where user is a member)
    const projects = await Project.find({
      "members.user": userId,
    })
      .populate("workspace", "name")
      .select(
        "_id name description workspace status priority startDate dueDate color tags members taskCounter createdAt"
      )
      .lean();

    // Build project context with user roles
    const projectContext = projects.map((proj) => {
      const memberInfo = proj.members.find(
        (m) => m.user.toString() === userId.toString()
      );
      return {
        id: proj._id,
        name: proj.name,
        description: proj.description,
        workspace: {
          id: proj.workspace._id,
          name: proj.workspace.name,
        },
        status: proj.status,
        priority: proj.priority,
        startDate: proj.startDate,
        dueDate: proj.dueDate,
        color: proj.color,
        tags: proj.tags,
        taskCounter: proj.taskCounter,
        userRole: memberInfo?.role || "member",
        createdAt: proj.createdAt,
        members: proj.members.map((m) => ({
          user: m.user,
          role: m.role,
        })),
      };
    });

    // Get user's assigned tasks
    const tasks = await Task.find({
      assignedTo: userId,
    })
      .populate("project", "name")
      .populate("workspace", "name")
      .select(
        "_id title description project workspace assignedTo createdBy status priority startDate dueDate tags dependencies estimatedHours actualHours sequence subtasks createdAt"
      )
      .lean();

    // Build task context
    const taskContext = tasks.map((task) => ({
      id: task._id,
      title: task.title,
      description: task.description,
      project: {
        id: task.project._id,
        name: task.project.name,
      },
      workspace: {
        id: task.workspace._id,
        name: task.workspace.name,
      },
      assignedTo: task.assignedTo,
      createdBy: task.createdBy,
      status: task.status,
      priority: task.priority,
      startDate: task.startDate,
      dueDate: task.dueDate,
      tags: task.tags,
      dependencies: task.dependencies,
      estimatedHours: task.estimatedHours,
      actualHours: task.actualHours,
      sequence: task.sequence,
      subtasks: task.subtasks,
      createdAt: task.createdAt,
    }));

    // Build payload for n8n
    const payload = {
      action: "sendMessage",
      sessionId: sessionId || `user-${Date.now()}`,
      chatInput: message,
      userContext: {
        authToken: req.headers.authorization, // Pass auth token inside userContext
        backendUrl: process.env.BACKEND_URL || "http://localhost:5000",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          phone: user.phone,
          bio: user.bio,
          role: user.role,
          joinedAt: user.createdAt,
        },
        workspaces: workspaceContext,
        projects: projectContext,
        tasks: taskContext,
      },
    };

    // Log what we're sending to n8n for debugging
    console.log("[API/chat] Sending to n8n:", {
      userName: user.name,
      userEmail: user.email,
      workspaceCount: workspaceContext.length,
      projectCount: projectContext.length,
      taskCount: taskContext.length,
    });

    // Send comprehensive context to n8n
    const response = await fetch(
      "https://buildsync2.app.n8n.cloud/webhook/8b085178-cf54-4bfe-812d-0e0d562ce3ac/chat",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    console.log("[API/chat] n8n status:", response.status);
    let data = {};
    try {
      data = await response.json();
      console.log("[API/chat] n8n response:", JSON.stringify(data, null, 2));
    } catch (jsonErr) {
      console.error("[API/chat] Failed to parse n8n response as JSON", jsonErr);
    }

    // Extract the AI's reply from various possible response structures
    let aiReply =
      data.output || data.reply || data.message || data.text || null;

    // If data is an array, get the first item
    if (Array.isArray(data) && data.length > 0) {
      aiReply =
        data[0].output ||
        data[0].reply ||
        data[0].message ||
        data[0].text ||
        null;
    }

    // Log what we extracted
    console.log("[API/chat] Extracted AI reply:", aiReply);

    // Log assistant message
    if (aiReply) {
      await AIChatLog.create({
        sessionId,
        userId,
        role: "assistant",
        content: aiReply,
      });
    }
    res.json({ reply: aiReply || null, n8n: data });
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
