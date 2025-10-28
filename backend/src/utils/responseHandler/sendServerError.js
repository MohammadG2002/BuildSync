/**
 * Send Server Error Response
 */

import { sendError } from "./sendError.js";

/**
 * Send internal server error response
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 */
export const sendServerError = (res, message = "Internal server error") => {
  return sendError(res, 500, message);
};
