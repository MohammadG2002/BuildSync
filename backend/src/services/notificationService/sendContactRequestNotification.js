/**
 * Send Contact Request Notification
 * Mirrors workspace invite notification pattern for contact requests
 */

import { createNotification } from "./createNotification.js";

/**
 * Send contact request notification
 * @param {Object} data
 * @param {string} data.recipientId - Recipient user ID
 * @param {string} data.senderId - Sender user ID
 * @param {string} [data.senderName] - Sender display name
 * @param {string} data.contactId - Contact relation ID
 * @returns {Promise<Object>} Created notification
 */
export const sendContactRequestNotification = async (data) => {
  const { recipientId, senderId, senderName, contactId } = data;

  return await createNotification({
    recipient: recipientId,
    sender: senderId,
    type: "contact_request",
    title: "New Contact Request",
    message: `${senderName || "Someone"} sent you a contact request`,
    // Deep-link to chat with sender
    link: `/app/chat/${senderId}`,
    metadata: { contactId },
  });
};
