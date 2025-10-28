/**
 * Create Task Validation
 */

import { body } from "express-validator";

export const createTaskValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Task title is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Title must be between 2 and 200 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage("Description cannot exceed 2000 characters"),
  body("project")
    .notEmpty()
    .withMessage("Project ID is required")
    .isMongoId()
    .withMessage("Invalid project ID"),
  body("workspace")
    .notEmpty()
    .withMessage("Workspace ID is required")
    .isMongoId()
    .withMessage("Invalid workspace ID"),
  body("assignedTo").optional().isMongoId().withMessage("Invalid user ID"),
  body("status")
    .optional()
    .isIn(["todo", "in-progress", "review", "done", "blocked"])
    .withMessage("Invalid status"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "urgent"])
    .withMessage("Invalid priority"),
  body("dueDate").optional().isISO8601().withMessage("Invalid due date format"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
];
