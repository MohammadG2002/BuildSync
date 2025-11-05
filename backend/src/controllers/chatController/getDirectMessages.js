/**
 * Get Direct Messages Controller
 * @desc    Get direct messages with a specific user in a workspace
 * @route   GET /api/chat/:workspaceId/dm/:userId
 * @access  Private
 */

import Message from "../../models/Message/index.js";
import Workspace from "../../models/Workspace/index.js";

export const getDirectMessages = async (req, res) => {
  try {
    const { workspaceId, userId } = req.params;
    const { limit = 50, before } = req.query;

    // Validate workspace membership
    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res
        .status(404)
        .json({ success: false, message: "Workspace not found" });
    }

    if (!workspace.isMember(req.user._id)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Query for messages between current user and userId in this workspace
    const currentUserId = req.user._id;

    const query = {
      workspace: workspaceId,
      isDeleted: false,
      $or: [
        { sender: currentUserId, recipient: userId },
        { sender: userId, recipient: currentUserId },
      ],
    };

    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await Message.find(query)
      .populate("sender", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10));

    res.json({
      success: true,
      count: messages.length,
      data: { messages: messages.reverse() },
    });
  } catch (error) {
    console.error("Get direct messages error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch messages" });
  }
};
