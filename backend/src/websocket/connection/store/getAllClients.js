/**
 * Get All Clients
 * Returns the entire clients Map
 */

import clients from "./clientStore.js";

/**
 * Get all connected clients
 * @returns {Map} Map of all clients
 */
export const getAllClients = () => {
  return clients;
};
