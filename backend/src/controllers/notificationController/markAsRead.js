/**
 * Mark As Read Controller
 * @desc    Mark notification as read
 * @route   PUT /api/notifications/:id/read
 * @access  Private
 */

import Notification from "../../models/Notification/index.js";

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Check if notification belongs to user
    if (notification.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({
      success: true,
      message: "Notification marked as read",
      data: { notification },
    });
  } catch (error) {
    console.error("Mark as read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};
