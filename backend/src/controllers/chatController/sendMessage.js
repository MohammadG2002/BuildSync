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
    const { content, type = "text", attachments } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Message content is required",
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
      content,
      type,
      attachments: attachments || [],
    });

    await message.populate("sender", "name email avatar");

    // Broadcast message to workspace via WebSocket
    broadcastToWorkspace(workspaceId, {
      type: "new_message",
      data: message,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: { message },
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message",
    });
  }
};
