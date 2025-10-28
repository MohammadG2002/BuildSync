/**
 * Send Bad Request Response
 */

import { sendError } from "./sendError.js";

/**
 * Send bad request response
 * @param {Object} res - Express response object
 * @param {String} message - Bad request message
 * @param {Object} errors - Validation errors
 */
export const sendBadRequest = (res, message = "Bad request", errors = null) => {
  return sendError(res, 400, message, errors);
};
