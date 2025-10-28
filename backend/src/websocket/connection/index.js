/**
 * WebSocket Connection Management
 * Centralized connection utilities
 */

export { authenticateConnection } from "./authenticate.js";
export { getAllClients, getOnlineUsersCount } from "./store/index.js";
export {
  addClient,
  removeClient,
  getClientConnections,
  isUserOnline,
} from "./manager/index.js";
export { sendToClient, sendWelcomeMessage } from "./sender/index.js";
