/**
 * Send Conflict Response
 */

import { sendError } from "./sendError.js";

/**
 * Send conflict response
 * @param {Object} res - Express response object
 * @param {String} message - Conflict message
 */
export const sendConflict = (res, message = "Resource already exists") => {
  return sendError(res, 409, message);
};
