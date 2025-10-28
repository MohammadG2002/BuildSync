/**
 * Delete Notification Controller
 * @desc    Delete notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */

import Notification from "../../models/Notification/index.js";

export const deleteNotification = async (req, res) => {
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

    await notification.deleteOne();

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Delete notification error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};
