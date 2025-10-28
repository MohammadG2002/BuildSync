/**
 * Notification Operations - Handles notification state operations
 */
export class NotificationOperations {
  /**
   * Mark notification as read
   * @param {Array} notifications - Current notifications array
   * @param {string} notificationId - ID of notification to mark as read
   * @returns {Object} Updated notifications and unread count
   */
  static markAsRead(notifications, notificationId) {
    const updatedNotifications = notifications.map((n) =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    const unreadCount = updatedNotifications.filter((n) => !n.read).length;
    return { notifications: updatedNotifications, unreadCount };
  }

  /**
   * Mark all notifications as read
   * @param {Array} notifications - Current notifications array
   * @returns {Object} Updated notifications with all marked as read
   */
  static markAllAsRead(notifications) {
    const updatedNotifications = notifications.map((n) => ({
      ...n,
      read: true,
    }));
    return { notifications: updatedNotifications, unreadCount: 0 };
  }

  /**
   * Delete notification
   * @param {Array} notifications - Current notifications array
   * @param {string} notificationId - ID of notification to delete
   * @returns {Object} Updated notifications and unread count
   */
  static deleteNotification(notifications, notificationId) {
    const notification = notifications.find((n) => n.id === notificationId);
    const updatedNotifications = notifications.filter(
      (n) => n.id !== notificationId
    );
    const unreadDelta = notification && !notification.read ? -1 : 0;
    const unreadCount = Math.max(
      0,
      updatedNotifications.filter((n) => !n.read).length
    );
    return { notifications: updatedNotifications, unreadCount, unreadDelta };
  }

  /**
   * Add new notification
   * @param {Array} notifications - Current notifications array
   * @param {Object} notification - New notification to add
   * @returns {Object} Updated notifications and unread count
   */
  static addNotification(notifications, notification) {
    const updatedNotifications = [notification, ...notifications];
    const unreadCount = updatedNotifications.filter((n) => !n.read).length;
    return { notifications: updatedNotifications, unreadCount };
  }

  /**
   * Calculate unread count
   * @param {Array} notifications - Notifications array
   * @returns {number} Number of unread notifications
   */
  static calculateUnreadCount(notifications) {
    return notifications.filter((n) => !n.read).length;
  }
}
