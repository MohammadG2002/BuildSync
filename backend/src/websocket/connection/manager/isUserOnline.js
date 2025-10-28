/**
 * Is User Online
 * Checks if a user has any active connections
 */

import clients from "../store/clientStore.js";

/**
 * Check if user is online
 * @param {String} userId - User ID
 * @returns {Boolean} True if user is online
 */
export const isUserOnline = (userId) => {
  return clients.has(userId.toString());
};
