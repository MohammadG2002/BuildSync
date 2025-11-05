/**
 * Send Contact Accepted Notification
 * Mirrors workspace invite notification pattern for acceptance
 */

import { createNotification } from "./createNotification.js";

/**
 * Send contact accepted notification
 * @param {Object} data
 * @param {string} data.recipientId - Recipient user ID (original requester)
 * @param {string} data.senderId - Sender user ID (accepting user)
 * @param {string} [data.senderName] - Sender display name
 * @param {string} data.contactId - Contact relation ID
 * @returns {Promise<Object>} Created notification
 */
export const sendContactAcceptedNotification = async (data) => {
  const { recipientId, senderId, senderName, contactId } = data;

  return await createNotification({
    recipient: recipientId,
    sender: senderId,
    type: "contact_accepted",
    title: "Contact Accepted",
    message: `${senderName || "Someone"} accepted your contact request`,
    // Deep-link to chat with the acceptor
    link: `/app/chat/${senderId}`,
    metadata: { contactId },
  });
};
