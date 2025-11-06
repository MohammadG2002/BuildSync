/**
 * Mark Direct Conversation As Read
 * @desc    Mark all incoming messages from userId as read for current user
 * @route   PUT /api/chat/dm/:userId/read
 * @access  Private
 */

import Message from "../../models/Message/index.js";

export const markDirectRead = async (req, res) => {
  try {
    const { userId } = req.params;

    const me = req.user._id;

    const result = await Message.updateMany(
      {
        sender: userId,
        recipient: me,
        "readBy.user": { $ne: me },
      },
      {
        $push: { readBy: { user: me, readAt: new Date() } },
      }
    );

    return res.json({
      success: true,
      message: "Conversation marked as read",
      data: {
        matched: result.matchedCount || result.n,
        modified: result.modifiedCount || result.nModified,
      },
    });
  } catch (error) {
    console.error("Mark direct read error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to mark conversation as read" });
  }
};
