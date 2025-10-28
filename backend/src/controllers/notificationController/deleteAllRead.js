/**
 * Delete All Read Controller
 * @desc    Delete all read notifications
 * @route   DELETE /api/notifications/read-all
 * @access  Private
 */

import Notification from "../../models/Notification/index.js";

export const deleteAllRead = async (req, res) => {
  try {
    await Notification.deleteMany({
      recipient: req.user._id,
      read: true,
    });

    res.json({
      success: true,
      message: "All read notifications deleted successfully",
    });
  } catch (error) {
    console.error("Delete all read error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete read notifications",
    });
  }
};
