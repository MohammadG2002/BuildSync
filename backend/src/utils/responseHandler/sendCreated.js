/**
 * Send Created Response
 */

import { sendSuccess } from "./sendSuccess.js";

/**
 * Send created resource response
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {Object} data - Created resource data
 */
export const sendCreated = (res, message, data) => {
  return sendSuccess(res, 201, message, data);
};
