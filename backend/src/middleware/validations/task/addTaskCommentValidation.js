/**
 * Add Task Comment Validation
 */

import { body } from "express-validator";

export const addTaskCommentValidation = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ min: 1, max: 1000 })
    .withMessage("Comment must be between 1 and 1000 characters"),
];
