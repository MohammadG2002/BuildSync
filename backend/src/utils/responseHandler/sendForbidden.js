/**
 * Send Forbidden Response
 */

import { sendError } from "./sendError.js";

/**
 * Send forbidden response
 * @param {Object} res - Express response object
 * @param {String} message - Forbidden message
 */
export const sendForbidden = (res, message = "Access denied") => {
  return sendError(res, 403, message);
};
