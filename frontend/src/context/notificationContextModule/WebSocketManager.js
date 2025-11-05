import realtimeService from "../../services/realtime";

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
    // Connection lifecycle is handled globally by RealtimeProvider.
    // Here we only subscribe to events.
    const unsubscribers = [
      realtimeService.on("connected", () => {
        console.log("WebSocket connected - real-time notifications active");
        handlers.onConnected?.();
      }),

      realtimeService.on("disconnected", () => {
        console.log("WebSocket disconnected");
        handlers.onDisconnected?.();
      }),

      realtimeService.on("notification", (notification) => {
        handlers.onNotification?.(notification);
      }),

      realtimeService.on("task_update", (task) => {
        handlers.onTaskUpdate?.(task);
      }),

      realtimeService.on("project_update", (project) => {
        handlers.onProjectUpdate?.(project);
      }),

      realtimeService.on("member_joined", (member) => {
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
    (unsubscribers || []).forEach((unsubscribe) => {
      try {
        unsubscribe && unsubscribe();
      } catch (e) {
        // ignore
      }
    });
    // Do not disconnect the global realtime connection here.
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
