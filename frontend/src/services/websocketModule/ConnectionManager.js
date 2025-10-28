import { API_CONFIG } from "../../config/api.config";

/**
 * Connection Manager - Manages WebSocket connection lifecycle
 */
export class ConnectionManager {
  constructor() {
    this.ws = null;
    this.isConnecting = false;
    this.pingInterval = null;
  }

  /**
   * Connect to WebSocket server
   * @param {string} token - Authentication token
   * @param {Object} callbacks - Event callbacks (onOpen, onMessage, onError, onClose)
   * @returns {WebSocket} WebSocket instance
   */
  connect(token, callbacks) {
    if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
      console.log("WebSocket already connected or connecting");
      return this.ws;
    }

    this.isConnecting = true;
    const wsUrl = this.buildWebSocketUrl();

    try {
      this.ws = new WebSocket(`${wsUrl}?token=${token}`);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.isConnecting = false;
        callbacks.onOpen?.();
      };

      this.ws.onmessage = (event) => {
        callbacks.onMessage?.(event);
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.isConnecting = false;
        callbacks.onError?.(error);
      };

      this.ws.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        this.isConnecting = false;
        this.stopPing();
        callbacks.onClose?.(event);
      };

      return this.ws;
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
      this.isConnecting = false;
      callbacks.onError?.(error);
      return null;
    }
  }

  /**
   * Build WebSocket URL from API config
   * @returns {string} WebSocket URL
   */
  buildWebSocketUrl() {
    return (
      API_CONFIG.BASE_URL.replace(/^http/, "ws").replace(/\/api$/, "") + "/ws"
    );
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
   * Start ping interval to keep connection alive
   * @param {Function} sendPing - Function to send ping message
   */
  startPing(sendPing) {
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        sendPing();
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
