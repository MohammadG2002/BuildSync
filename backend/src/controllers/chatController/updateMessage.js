/**
 * Update Message Controller
 * @desc    Update message
 * @route   PUT /api/chat/:workspaceId/:messageId
 * @access  Private
 */

import Message from "../../models/Message/index.js";
import { broadcastToWorkspace } from "../../websocket/index.js";

export const updateMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Check if user is sender
    if (message.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own messages",
      });
    }

    message.content = content;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    await message.populate("sender", "name email avatar");

    // Broadcast update via WebSocket
    broadcastToWorkspace(message.workspace.toString(), {
      type: "message_updated",
      data: message,
    });

    res.json({
      success: true,
      message: "Message updated successfully",
      data: { message },
    });
  } catch (error) {
    console.error("Update message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update message",
    });
  }
};
