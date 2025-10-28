/**
 * MongoDB ID Validation
 */

import { param } from "express-validator";

export const mongoIdValidation = (paramName = "id") => [
  param(paramName)
    .notEmpty()
    .withMessage(`${paramName} is required`)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`),
];
