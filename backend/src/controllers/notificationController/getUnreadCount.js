/**
 * Get Unread Count Controller
 * @desc    Get unread notifications count
 * @route   GET /api/notifications/unread/count
 * @access  Private
 */

import Notification from "../../models/Notification/index.js";

export const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.json({
      success: true,
      data: { count },
    });
  } catch (error) {
    console.error("Get unread count error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch unread count",
    });
  }
};
