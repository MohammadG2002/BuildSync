/**
 * Send Success Response
 */

/**
 * Send success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object} data - Response data
 */
export const sendSuccess = (res, statusCode = 200, message, data = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    ...data,
  });
};
