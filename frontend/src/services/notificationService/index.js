import apiClient from "../apiClient";

/**
 * Fetch all notifications for the current user
 * @returns {Promise<Array>} List of notifications
 */
export const getNotifications = async () => {
  const response = await apiClient.get("/notifications");
  return response.data.notifications || [];
};

/**
 * Get unread notifications count
 * @returns {Promise<number>} Unread count
 */
export const getUnreadCount = async () => {
  const response = await apiClient.get("/notifications/unread/count");
  return response.data.count;
};

/**
 * Mark a notification as read
 * @param {string} notificationId - Notification ID
 * @returns {Promise<Object>} Updated notification
 */
export const markAsRead = async (notificationId) => {
  const response = await apiClient.put(`/notifications/${notificationId}/read`);
  return response.data;
};

/**
 * Mark all notifications as read
 * @returns {Promise<Object>} Result
 */
export const markAllAsRead = async () => {
  const response = await apiClient.put("/notifications/read-all");
  return response.data;
};

/**
 * Delete a notification
 * @param {string} notificationId - Notification ID
 * @returns {Promise<void>}
 */
export const deleteNotification = async (notificationId) => {
  await apiClient.delete(`/notifications/${notificationId}`);
};

/**
 * Delete all read notifications
 * @returns {Promise<void>}
 */
export const deleteAllRead = async () => {
  await apiClient.delete("/notifications/read-all");
};
