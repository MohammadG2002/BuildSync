/**
 * Send No Content Response
 */

/**
 * Send no content response
 * @param {Object} res - Express response object
 */
export const sendNoContent = (res) => {
  return res.status(204).send();
};
