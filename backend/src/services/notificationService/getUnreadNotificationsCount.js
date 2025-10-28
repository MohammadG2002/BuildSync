/**
 * Get Unread Notifications Count
 * Gets count of unread notifications
 */

import Notification from "../../models/Notification/index.js";

/**
 * Get unread notifications count
 * @param {String} userId - User ID
 * @returns {Number} Unread count
 */
export const getUnreadNotificationsCount = async (userId) => {
  const count = await Notification.countDocuments({
    recipient: userId,
    isRead: false,
  });

  return count;
};
