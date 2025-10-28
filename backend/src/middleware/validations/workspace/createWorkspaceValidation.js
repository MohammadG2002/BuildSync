/**
 * Create Workspace Validation
 */

import { body } from "express-validator";

export const createWorkspaceValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Workspace name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("settings")
    .optional()
    .isObject()
    .withMessage("Settings must be an object"),
];
