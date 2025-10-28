/**
 * Send Not Found Response
 */

import { sendError } from "./sendError.js";

/**
 * Send not found response
 * @param {Object} res - Express response object
 * @param {String} message - Not found message
 */
export const sendNotFound = (res, message = "Resource not found") => {
  return sendError(res, 404, message);
};
