/**
 * Mark As Read Controller
 * @desc    Mark message as read
 * @route   PUT /api/chat/:workspaceId/:messageId/read
 * @access  Private
 */

import Message from "../../models/Message/index.js";

export const markAsRead = async (req, res) => {
  try {
    const { messageId } = req.params;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found",
      });
    }

    // Check if already marked as read by this user
    const alreadyRead = message.readBy.some(
      (read) => read.user.toString() === req.user._id.toString()
    );

    if (!alreadyRead) {
      message.readBy.push({
        user: req.user._id,
        readAt: new Date(),
      });
      await message.save();
    }

    res.json({
      success: true,
      message: "Message marked as read",
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark message as read",
    });
  }
};
