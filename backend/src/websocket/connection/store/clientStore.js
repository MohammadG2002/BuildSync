/**
 * Client Store
 * Manages connected WebSocket clients
 */

// Store connected clients: Map<userId, Set<WebSocket>>
const clients = new Map();

export default clients;
