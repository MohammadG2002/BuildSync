/**
 * Delete Message Controller
 * @desc    Delete message
 * @route   DELETE /api/chat/:workspaceId/:messageId
 * @access  Private
 */

import Message from "../../models/Message/index.js";
import { broadcastToWorkspace } from "../../websocket/index.js";

export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;

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
        message: "You can only delete your own messages",
      });
    }

    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    // Broadcast deletion via WebSocket
    broadcastToWorkspace(message.workspace.toString(), {
      type: "message_deleted",
      data: { messageId },
    });

    res.json({
      success: true,
      message: "Message deleted successfully",
    });
  } catch (error) {
    console.error("Delete message error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete message",
    });
  }
};
