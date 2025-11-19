/**
 * Mark Many As Read Controller
 * @desc    Mark a set of notifications as read
 * @route   PUT /api/notifications/read
 * @access  Private
 */

import Notification from "../../models/Notification/index.js";

export const markManyAsRead = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide an array of notification ids to mark as read",
      });
    }

    // Only process notifications belonging to the authenticated user.
    const filter = { _id: { $in: ids }, recipient: req.user._id, read: false };
    const now = new Date();

    const result = await Notification.updateMany(filter, {
      $set: { read: true, readAt: now },
    });

    res.json({
      success: true,
      message: "Selected notifications marked as read",
      data: {
        matched: result.matchedCount ?? result.nMatched,
        modified: result.modifiedCount ?? result.nModified,
      },
    });
  } catch (error) {
    console.error("Mark many as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark selected notifications as read",
    });
  }
};
