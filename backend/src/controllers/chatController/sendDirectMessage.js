/**
 * Send Direct Message Controller
 * @desc    Send a direct message to a user in a workspace
 * @route   POST /api/chat/:workspaceId/dm/:userId
 * @access  Private
 */

import Message from "../../models/Message/index.js";
import Workspace from "../../models/Workspace/index.js";
import { sendEventToUser } from "../../websocket/index.js";

export const sendDirectMessage = async (req, res) => {
  try {
    const { workspaceId, userId } = req.params;
    const { content, type = "text", attachments } = req.body;

    if (!content || content.trim() === "") {
      return res
        .status(400)
        .json({ success: false, message: "Message content is required" });
    }

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res
        .status(404)
        .json({ success: false, message: "Workspace not found" });
    }

    if (!workspace.isMember(req.user._id) || !workspace.isMember(userId)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const message = await Message.create({
      workspace: workspaceId,
      sender: req.user._id,
      recipient: userId,
      content,
      type,
      attachments: attachments || [],
    });

    await message.populate("sender", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: { message },
    });

    // Realtime: deliver DM to both participants only
    try {
      sendEventToUser(userId, "dm_message", message);
      sendEventToUser(req.user._id, "dm_message", message);
    } catch (e) {
      console.error("DM broadcast failed:", e);
    }
  } catch (error) {
    console.error("Send direct message error:", error);
    res.status(500).json({ success: false, message: "Failed to send message" });
  }
};
