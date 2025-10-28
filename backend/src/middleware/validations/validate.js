/**
 * Validation Result Handler
 * Middleware to check and format validation errors
 */

import { validationResult } from "express-validator";
import { sendBadRequest } from "../../utils/responseHandler/index.js";

/**
 * Middleware to check validation results
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Next middleware
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path,
      message: err.msg,
    }));

    return sendBadRequest(res, "Validation failed", formattedErrors);
  }

  next();
};
