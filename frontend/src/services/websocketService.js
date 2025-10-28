import {
  ConnectionManager,
  ReconnectStrategy,
  EventEmitter,
  MessageHandler,
} from "./websocketModule";

class WebSocketService {
  constructor() {
    this.connectionManager = new ConnectionManager();
    this.reconnectStrategy = new ReconnectStrategy();
    this.eventEmitter = new EventEmitter();
    this.messageHandler = new MessageHandler(this.eventEmitter);
  }

  /**
   * Connect to WebSocket server
   * @param {string} token - Authentication token
   */
  connect(token) {
    this.connectionManager.connect(token, {
      onOpen: () => {
        this.reconnectStrategy.reset();
        this.eventEmitter.emit("connected");
        this.connectionManager.startPing(() => this.send("ping", {}));
      },
      onMessage: (event) => {
        this.messageHandler.handleMessage(event);
      },
      onError: (error) => {
        this.eventEmitter.emit("error", error);
      },
      onClose: (event) => {
        this.eventEmitter.emit("disconnected", {
          code: event.code,
          reason: event.reason,
        });
        this.reconnectStrategy.attemptReconnect(
          token,
          (t) => this.connect(t),
          () => this.eventEmitter.emit("max_reconnect_attempts")
        );
      },
    });
  }

  /**
   * Send message through WebSocket
   * @param {string} type - Message type
   * @param {Object} payload - Message payload
   */
  send(type, payload) {
    this.connectionManager.send(type, payload);
  }

  /**
   * Subscribe to WebSocket events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} Unsubscribe function
   */
  on(event, callback) {
    return this.eventEmitter.on(event, callback);
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    this.connectionManager.disconnect();
    this.eventEmitter.clear();
    this.reconnectStrategy.reset();
  }

  /**
   * Get WebSocket connection state
   * @returns {number} WebSocket ready state
   */
  getState() {
    return this.connectionManager.getState();
  }

  /**
   * Check if WebSocket is connected
   * @returns {boolean} Connection status
   */
  isConnected() {
    return this.connectionManager.isConnected();
  }
}

// Export singleton instance
export const websocketService = new WebSocketService();
export default websocketService;
