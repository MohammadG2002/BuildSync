/**
 * User-Level Broadcasting
 * Handles sending notifications to specific users
 */

import { getAllClients, sendToClient } from "../connection/index.js";

/**
 * Send notification to specific user
 * @param {String} userId - User ID
 * @param {Object} notification - Notification data
 */
export const sendNotificationToUser = (userId, notification) => {
  const userClients = getAllClients().get(userId.toString());

  if (!userClients) {
    console.log(`User ${userId} is not online`);
    return;
  }

  const message = {
    type: "notification",
    data: notification,
  };

  let sentCount = 0;
  userClients.forEach((client) => {
    if (sendToClient(client, message)) {
      sentCount++;
    }
  });

  console.log(`Sent notification to user ${userId} (${sentCount} connections)`);
};
