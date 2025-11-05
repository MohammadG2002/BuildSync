/**
 * User-Level Broadcasting
 * Handles sending notifications to specific users
 */

import { getAllClients, sendToClient } from "../connection/index.js";
import {
  pusherEnabled,
  publishToUser as pusherPublishToUser,
} from "../../services/realtime/index.js";

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
    payload: notification,
  };

  let sentCount = 0;
  userClients.forEach((client) => {
    if (sendToClient(client, message)) {
      sentCount++;
    }
  });

  console.log(`Sent notification to user ${userId} (${sentCount} connections)`);

  // Also publish to cloud provider if enabled
  if (pusherEnabled) {
    pusherPublishToUser(userId, "notification", notification);
  }
};

/**
 * Send arbitrary event to specific user
 * @param {String} userId - User ID
 * @param {String} type - Event type
 * @param {Object} payload - Event payload
 */
export const sendEventToUser = (userId, type, payload) => {
  const userClients = getAllClients().get(userId.toString());

  if (!userClients) {
    console.log(`User ${userId} is not online`);
    return;
  }

  const message = { type, payload };

  let sentCount = 0;
  userClients.forEach((client) => {
    if (sendToClient(client, message)) {
      sentCount++;
    }
  });

  console.log(`Sent ${type} to user ${userId} (${sentCount} connections)`);

  // Also publish to cloud provider if enabled
  if (pusherEnabled) {
    pusherPublishToUser(userId, type, payload);
  }
};
