/**
 * Get Notifications Controller
 * @desc    Get all notifications for user
 * @route   GET /api/notifications
 * @access  Private
 */

import Notification from "../../models/Notification/index.js";

export const getNotifications = async (req, res) => {
  try {
    const { read, limit = 50 } = req.query;

    const query = { recipient: req.user._id };
    if (read !== undefined) {
      query.read = read === "true";
    }

    const notifications = await Notification.find(query)
      .populate("sender", "name email avatar")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: { notifications },
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};
