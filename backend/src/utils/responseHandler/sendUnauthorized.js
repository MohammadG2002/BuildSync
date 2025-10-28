/**
 * Send Unauthorized Response
 */

import { sendError } from "./sendError.js";

/**
 * Send unauthorized response
 * @param {Object} res - Express response object
 * @param {String} message - Unauthorized message
 */
export const sendUnauthorized = (res, message = "Authentication required") => {
  return sendError(res, 401, message);
};
