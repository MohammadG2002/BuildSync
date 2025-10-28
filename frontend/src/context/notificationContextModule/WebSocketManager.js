import websocketService from "../../services/websocketService";

/**
 * WebSocket Manager - Handles WebSocket connection and event subscriptions
 */
export class WebSocketManager {
  /**
   * Initialize WebSocket connection and subscribe to events
   * @param {string} token - Authentication token
   * @param {Object} handlers - Event handler callbacks
   * @returns {Array} Array of unsubscribe functions
   */
  static connect(token, handlers) {
    websocketService.connect(token);

    const unsubscribers = [
      websocketService.on("connected", () => {
        console.log("WebSocket connected - real-time notifications active");
        handlers.onConnected?.();
      }),

      websocketService.on("disconnected", () => {
        console.log("WebSocket disconnected");
        handlers.onDisconnected?.();
      }),

      websocketService.on("notification", (notification) => {
        handlers.onNotification?.(notification);
      }),

      websocketService.on("task_update", (task) => {
        handlers.onTaskUpdate?.(task);
      }),

      websocketService.on("project_update", (project) => {
        handlers.onProjectUpdate?.(project);
      }),

      websocketService.on("member_joined", (member) => {
        handlers.onMemberJoined?.(member);
      }),
    ];

    return unsubscribers;
  }

  /**
   * Disconnect WebSocket and cleanup
   * @param {Array} unsubscribers - Array of unsubscribe functions
   */
  static disconnect(unsubscribers) {
    unsubscribers.forEach((unsubscribe) => unsubscribe());
    websocketService.disconnect();
  }

  /**
   * Request browser notification permission
   */
  static async requestPermission() {
    if (Notification.permission === "default") {
      await Notification.requestPermission();
    }
  }
}
