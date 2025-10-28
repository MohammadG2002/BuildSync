/**
 * Reconnect Strategy - Handles automatic reconnection with exponential backoff
 */
export class ReconnectStrategy {
  constructor() {
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000;
  }

  /**
   * Attempt to reconnect to WebSocket
   * @param {string} token - Authentication token
   * @param {Function} connectFn - Function to call for reconnection
   * @param {Function} onMaxAttempts - Callback when max attempts reached
   */
  attemptReconnect(token, connectFn, onMaxAttempts) {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      onMaxAttempts?.();
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(
      `Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`
    );

    setTimeout(() => {
      connectFn(token);
    }, delay);
  }

  /**
   * Reset reconnect attempts counter
   */
  reset() {
    this.reconnectAttempts = 0;
  }

  /**
   * Get current reconnect attempt number
   * @returns {number} Current attempt number
   */
  getAttempts() {
    return this.reconnectAttempts;
  }
}
