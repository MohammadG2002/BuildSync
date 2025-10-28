/**
 * Update Project Validation
 */

import { body } from "express-validator";

export const updateProjectValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),
  body("status")
    .optional()
    .isIn(["planning", "active", "on-hold", "completed", "archived"])
    .withMessage("Invalid status"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "urgent"])
    .withMessage("Invalid priority"),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Invalid start date format"),
  body("dueDate").optional().isISO8601().withMessage("Invalid due date format"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("color")
    .optional()
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)
    .withMessage("Invalid color format (must be hex color)"),
];
