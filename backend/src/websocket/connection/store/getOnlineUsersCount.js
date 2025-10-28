/**
 * Get Online Users Count
 * Returns the number of online users
 */

import clients from "./clientStore.js";

/**
 * Get online users count
 * @returns {Number} Count of online users
 */
export const getOnlineUsersCount = () => {
  return clients.size;
};
