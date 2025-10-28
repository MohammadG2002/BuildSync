/**
 * Send Task Assignment Notification
 * Sends notification for task assignment
 */

import { createNotification } from "./createNotification.js";

/**
 * Send task assignment notification
 * @param {Object} data - Notification data
 * @returns {Object} Created notification
 */
export const sendTaskAssignmentNotification = async (data) => {
  const { recipientId, senderId, senderName, taskTitle, taskId } = data;

  return await createNotification({
    recipient: recipientId,
    sender: senderId,
    type: "task_assigned",
    title: "Task Assigned",
    message: `${senderName} assigned you to the task "${taskTitle}"`,
    link: `/tasks/${taskId}`,
    metadata: { taskId },
  });
};
