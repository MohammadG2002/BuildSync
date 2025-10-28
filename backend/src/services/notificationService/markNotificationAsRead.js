/**
 * Mark Notification As Read
 * Marks a single notification as read
 */

import Notification from "../../models/Notification/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

/**
 * Mark notification as read
 * @param {String} notificationId - Notification ID
 * @param {String} userId - User ID (for ownership check)
 * @returns {Object} Updated notification
 */
export const markNotificationAsRead = async (notificationId, userId) => {
  if (!isValidObjectId(notificationId)) {
    throw new Error("Invalid notification ID");
  }

  const notification = await Notification.findById(notificationId);

  if (!notification) {
    throw new Error("Notification not found");
  }

  // Check if user owns this notification
  if (notification.recipient.toString() !== userId.toString()) {
    throw new Error("Access denied");
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  return notification;
};
