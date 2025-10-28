/**
 * Get User Notifications
 * Retrieves notifications for a user
 */

import Notification from "../../models/Notification/index.js";

/**
 * Get user notifications
 * @param {String} userId - User ID
 * @param {Object} options - Query options (read status, limit)
 * @returns {Array} Notifications
 */
export const getUserNotifications = async (userId, options = {}) => {
  const { isRead, limit = 50 } = options;

  const query = { recipient: userId };

  if (isRead !== undefined) {
    query.isRead = isRead === "true";
  }

  const notifications = await Notification.find(query)
    .populate("sender", "name email avatar")
    .sort({ createdAt: -1 })
    .limit(limit);

  return notifications;
};
