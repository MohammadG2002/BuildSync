/**
 * Delete Notification
 * Deletes a notification
 */

import Notification from "../../models/Notification/index.js";
import { isValidObjectId } from "../../utils/validators/index.js";

/**
 * Delete notification
 * @param {String} notificationId - Notification ID
 * @param {String} userId - User ID (for ownership check)
 * @returns {Boolean} Success status
 */
export const deleteNotification = async (notificationId, userId) => {
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

  await notification.deleteOne();

  return true;
};
