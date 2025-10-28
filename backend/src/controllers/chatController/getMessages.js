/**
 * Get Messages Controller
 * @desc    Get messages for workspace
 * @route   GET /api/chat/:workspaceId
 * @access  Private
 */

import Message from "../../models/Message/index.js";
import Workspace from "../../models/Workspace/index.js";

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
