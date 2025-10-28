import { NotificationHandler } from "./NotificationHandler";

/**
 * Message Handler - Processes different types of WebSocket messages
 */
export class MessageHandler {
  constructor(eventEmitter) {
    this.eventEmitter = eventEmitter;
  }

  /**
   * Handle incoming WebSocket message
   * @param {MessageEvent} event - WebSocket message event
   */
  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      this.processMessage(data);
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error);
    }
  }

  /**
   * Process parsed message data
   * @param {Object} data - Parsed message data
   */
  processMessage(data) {
    const { type, payload } = data;

    // Emit event to all listeners
    this.eventEmitter.emit(type, payload);

    // Handle specific message types
    switch (type) {
      case "notification":
        this.handleNotification(payload);
        break;
      case "task_update":
        this.handleTaskUpdate(payload);
        break;
      case "project_update":
        this.handleProjectUpdate(payload);
        break;
      case "member_joined":
      case "member_left":
        this.handleMemberUpdate(payload);
        break;
      case "pong":
        // Response to ping
        break;
      default:
        console.log("Unknown message type:", type);
    }
  }

  /**
   * Handle notification message
   * @param {Object} notification - Notification data
   */
  handleNotification(notification) {
    NotificationHandler.show(notification);

    // Play notification sound
    if (notification.sound !== false) {
      NotificationHandler.playSound();
    }
  }

  /**
   * Handle task update message
   * @param {Object} task - Task data
   */
  handleTaskUpdate(task) {
    console.log("Task updated:", task);
  }

  /**
   * Handle project update message
   * @param {Object} project - Project data
   */
  handleProjectUpdate(project) {
    console.log("Project updated:", project);
  }

  /**
   * Handle member update message
   * @param {Object} member - Member data
   */
  handleMemberUpdate(member) {
    console.log("Member update:", member);
  }
}
