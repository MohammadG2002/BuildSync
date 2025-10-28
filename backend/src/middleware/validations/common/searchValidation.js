/**
 * Search Query Validation
 */

import { query } from "express-validator";

export const searchValidation = [
  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search query must be between 1 and 100 characters"),
];
