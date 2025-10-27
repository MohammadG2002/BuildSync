import { API_BASE_URL } from "../config/api.config";

class WebSocketService {
  constructor() {
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
    this.listeners = new Map();
    this.isConnecting = false;
    this.pingInterval = null;
  }

  /**
   * Connect to WebSocket server
   * @param {string} token - Authentication token
   */
  connect(token) {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      console.log("WebSocket already connected or connecting");
      return;
    }

    this.isConnecting = true;
    const wsUrl = API_BASE_URL.replace(/^http/, "ws") + "/ws";

    try {
      this.ws = new WebSocket(`${wsUrl}?token=${token}`);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit("connected");
        this.startPing();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
        this.emit("error", error);
      };

      this.ws.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        this.isConnecting = false;
        this.stopPing();
        this.emit("disconnected", { code: event.code, reason: event.reason });
        this.attemptReconnect(token);
      };
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.isConnecting = false;
      this.emit("error", error);
    }
  }

  /**
   * Handle incoming WebSocket messages
   * @param {Object} data - Message data
   */
  handleMessage(data) {
    const { type, payload } = data;

    // Emit event to all listeners
    this.emit(type, payload);

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
    // Request browser notification permission if not granted
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Show browser notification
    if (Notification.permission === "granted") {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: "/logo.png",
        badge: "/logo.png",
        tag: notification.id,
        requireInteraction: notification.priority === "high",
      });

      browserNotification.onclick = () => {
        window.focus();
        if (notification.link) {
          window.location.href = notification.link;
        }
        browserNotification.close();
      };
    }

    // Play notification sound
    if (notification.sound !== false) {
      this.playNotificationSound();
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

  /**
   * Play notification sound
   */
  playNotificationSound() {
    try {
      const audio = new Audio("/sounds/notification.mp3");
      audio.volume = 0.5;
      audio.play().catch((error) => {
        console.error("Failed to play notification sound:", error);
      });
    } catch (error) {
      console.error("Error creating audio:", error);
    }
  }

  /**
   * Attempt to reconnect to WebSocket
   * @param {string} token - Authentication token
   */
  attemptReconnect(token) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      this.emit("max_reconnect_attempts");
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`
    );

    setTimeout(() => {
      this.connect(token);
    }, delay);
  }

  /**
   * Start ping interval to keep connection alive
   */
  startPing() {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send("ping", {});
      }
    }, 30000); // Ping every 30 seconds
  }

  /**
   * Stop ping interval
   */
  stopPing() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Send message through WebSocket
   * @param {string} type - Message type
   * @param {Object} payload - Message payload
   */
  send(type, payload) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }));
    } else {
      console.warn("WebSocket is not connected");
    }
  }

  /**
   * Subscribe to WebSocket events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  /**
   * Emit event to all listeners
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((callback) => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} listener:`, error);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    this.stopPing();
    if (this.ws) {
      this.ws.close(1000, "Client disconnecting");
      this.ws = null;
    }
    this.listeners.clear();
    this.reconnectAttempts = 0;
  }

  /**
   * Get WebSocket connection state
   * @returns {number} WebSocket ready state
   */
  getState() {
    return this.ws?.readyState ?? WebSocket.CLOSED;
  }

  /**
   * Check if WebSocket is connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
export default websocketService;
