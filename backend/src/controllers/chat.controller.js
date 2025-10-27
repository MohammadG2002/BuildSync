import Message from "../models/Message.js";
import Workspace from "../models/Workspace.js";
import { broadcastToWorkspace } from "../websocket/websocket.js";

// @desc    Get messages for workspace
// @route   GET /api/chat/:workspaceId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { limit = 50, before } = req.query;

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

    // Build query
    const query = {
      workspace: workspaceId,
      isDeleted: false,
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate("sender", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      count: messages.length,
      data: { messages: messages.reverse() },
    });
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
};

// @desc    Send message
// @route   POST /api/chat/:workspaceId
// @access  Private
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

// @desc    Update message
// @route   PUT /api/chat/:workspaceId/:messageId
// @access  Private
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

// @desc    Delete message
// @route   DELETE /api/chat/:workspaceId/:messageId
// @access  Private
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

// @desc    Mark message as read
// @route   PUT /api/chat/:workspaceId/:messageId/read
// @access  Private
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
