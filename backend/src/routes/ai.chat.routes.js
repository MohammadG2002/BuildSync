import express from "express";
import rateLimit from "express-rate-limit";
import { chatReply, moderateText } from "../services/aiChatService.js";
import Project from "../models/Project/index.js";
import Workspace from "../models/Workspace/index.js";
import { executeAICommand } from "../utils/ai/aiActionService.js";
import Chat from "../models/Chat/index.js";

// Per-route rate limiter for AI to protect from runaway usage.
// Use per-user keying when available (req.user._id) to avoid IP rotation abuse.
const aiLimiter = rateLimit({
  windowMs: Number(process.env.AI_RATE_LIMIT_WINDOW_MS) || 10 * 60 * 1000, // 10 min
  max: Number(process.env.AI_RATE_LIMIT_MAX_REQUESTS) || 10, // 10 requests per window per user/ip
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: function (req /*, res*/) {
    // Prefer authenticated user id
    if (req.user && req.user._id) return String(req.user._id);
    // Fallback to IP
    return req.ip;
  },
});

const router = express.Router();

// POST /api/ai/chat
router.post("/chat", aiLimiter, async (req, res) => {
  try {
    const { messages } = req.body;

    // Basic validation: expect an array of messages
    if (!Array.isArray(messages) || messages.length === 0) {
      return res
        .status(400)
        .json({ error: "messages must be a non-empty array" });
    }

    // Limit message history size to avoid excessive token usage
    const maxHistory = Number(process.env.AI_MAX_HISTORY) || 12;
    if (messages.length > 200) {
      return res.status(400).json({ error: "messages array too large" });
    }

    // Trim to last N messages + preserve initial system message if present
    const systemMsg = messages.find((m) => m.role === "system");
    const tail = messages.slice(-maxHistory);
    const trimmed = systemMsg
      ? [systemMsg, ...tail.filter((m) => m !== systemMsg)]
      : tail;

    // Basic moderation: check last user message
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    if (lastUser && lastUser.content && process.env.AI_MOCK !== "true") {
      const mod = await moderateText(lastUser.content);
      if (mod && mod.flagged) {
        return res
          .status(403)
          .json({ error: "Content flagged by moderation", details: mod });
      }
    }

    // Inject minimal project/workspace context for authenticated user
    if (req.user) {
      try {
        const userProjects = await Project.find({ members: req.user._id })
          .select("_id name")
          .lean();
        const userWorkspaces = await Workspace.find({ members: req.user._id })
          .select("_id name")
          .lean();
        const contextMsg = {
          role: "system",
          content:
            "You can optionally output a JSON command to perform an action. " +
            "Available actions: create_project {name}, create_task {workspaceId} {optional projectId} {title} {description}. " +
            'Return JSON ONLY in the form {\n  "action": "create_project", "name": "..."\n} or {\n  "action": "create_task", "workspaceId": "...", "projectId": "...", "title": "...", "description": "..."\n}. ' +
            "Projects:" +
            JSON.stringify(userProjects) +
            " Workspaces:" +
            JSON.stringify(userWorkspaces),
        };
        // Prepend context if not already included
        trimmed.unshift(contextMsg);
      } catch (ctxErr) {
        console.warn("Failed to build AI context", ctxErr?.message);
      }
    }

    // Call provider
    const { text, usage } = (await chatReply(trimmed)) || {
      text: null,
      usage: null,
    };

    // Attempt command parsing & execution
    let actions = [];
    if (text) {
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const result = await executeAICommand(parsed, req.user);
          if (result) actions.push(result);
        }
      } catch (cmdErr) {
        actions.push({ type: "parse_error", message: cmdErr.message });
      }
    }

    // Persist chat session (best-effort). If user is authenticated, attach user id.
    try {
      const chatDoc = new Chat({
        user: req.user?._id || undefined,
        model: process.env.AI_MODEL,
        messages: trimmed.map((m) => ({ role: m.role, content: m.content })),
        usage: usage || undefined,
      });
      await chatDoc.save();
    } catch (saveErr) {
      console.warn("Failed to persist chat", saveErr?.message || saveErr);
    }

    res.json({ reply: text, usage, actions });
  } catch (err) {
    console.error("AI chat error", err);
    // In development, return the provider error message to help debugging.
    if (process.env.NODE_ENV === "development") {
      return res
        .status(500)
        .json({ error: "AI service error", details: err.message });
    }
    res.status(500).json({ error: "AI service error" });
  }
});

export default router;
