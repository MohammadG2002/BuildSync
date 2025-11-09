/**
 * Update Task Validation
 */

import { body } from "express-validator";

export const updateTaskValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage("Title must be between 2 and 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  body("assigneeIds")
    .optional()
    .custom((value) => {
      // Allow single ID, array of IDs, or null/undefined
      if (value === null || value === undefined) return true;
      if (typeof value === "string") return true; // Single ID
      if (Array.isArray(value)) return true; // Array of IDs
      return false;
    })
    .withMessage("Invalid assignee IDs format"),
  body("status")
    .optional()
    .isIn(["todo", "in-progress", "review", "completed", "blocked"])
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
  body("tags.*")
    .optional()
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage("Each tag must be a non-empty string up to 50 characters"),
  body("dependencies")
    .optional()
    .isArray()
    .withMessage("Dependencies must be an array of task IDs"),
  body("dependencies.*")
    .optional()
    .isMongoId()
    .withMessage("Invalid dependency task ID"),
];
