/**
 * Mark All Notifications As Read
 * Marks all user notifications as read
 */

import Notification from "../../models/Notification/index.js";

/**
 * Mark all notifications as read
 * @param {String} userId - User ID
 * @returns {Number} Number of updated notifications
 */
export const markAllNotificationsAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { recipient: userId, isRead: false },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    }
  );

  return result.modifiedCount;
};
