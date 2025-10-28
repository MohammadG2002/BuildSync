/**
 * Mark All As Read Controller
 * @desc    Mark all notifications as read
 * @route   PUT /api/notifications/read-all
 * @access  Private
 */

import Notification from "../../models/Notification/index.js";

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
    });
  }
};
