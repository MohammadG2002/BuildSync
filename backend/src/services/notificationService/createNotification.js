/**
 * Create Notification
 * Creates a new notification
 */

import Notification from "../../models/Notification/index.js";

/**
 * Create a notification
 * @param {Object} notificationData - Notification data
 * @returns {Object} Created notification
 */
export const createNotification = async (notificationData) => {
  const { recipient, sender, type, title, message, link, metadata } =
    notificationData;

  const notification = await Notification.create({
    recipient,
    sender,
    type,
    title,
    message,
    link,
    metadata: metadata || {},
  });

  await notification.populate("sender", "name email avatar");

  return notification;
};
