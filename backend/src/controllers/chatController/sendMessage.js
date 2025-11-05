/**
 * Send Message Controller
 * @desc    Send message
 * @route   POST /api/chat/:workspaceId
 * @access  Private
 */

import Message from "../../models/Message/index.js";
import Workspace from "../../models/Workspace/index.js";
import { broadcastToWorkspace } from "../../websocket/index.js";

export const sendMessage = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { content = "", type = "text", attachments } = req.body;
    // Sanitize attachments
    const cleanedAttachments = Array.isArray(attachments)
      ? attachments
          .filter((a) => a && typeof a === "object")
          .map((a) => ({
            name: a.name || "Attachment",
            url: a.url,
            size: typeof a.size === "number" ? a.size : undefined,
            type: a.type || undefined,
          }))
          .filter((a) => typeof a.url === "string" && a.url.length > 0)
      : [];

    const hasText = typeof content === "string" && content.trim() !== "";
    const hasAttachments = cleanedAttachments.length > 0;
    if (!hasText && !hasAttachments) {
      return res.status(400).json({
        success: false,
        message: "Message must include text or at least one attachment",
      });
    }

    // Check if user is member of workspace
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    if (!workspace.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const message = await Message.create({
      workspace: workspaceId,
      sender: req.user._id,
      content: hasText ? content : "",
      type,
      attachments: hasAttachments ? cleanedAttachments : [],
    });

    await message.populate("sender", "name email avatar");

    // Broadcast message to workspace via WebSocket
    broadcastToWorkspace(workspaceId, {
      type: "new_message",
      payload: message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: { message },
    });
  } catch (error) {
    console.error("Send message error:", error);
    const body = { success: false, message: "Failed to send message" };
    if (process.env.NODE_ENV !== "production") {
      body.error = error?.message;
    }
    res.status(500).json(body);
  }
};
