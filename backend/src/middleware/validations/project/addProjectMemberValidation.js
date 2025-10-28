/**
 * Add Project Member Validation
 */

import { body } from "express-validator";

export const addProjectMemberValidation = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("Invalid user ID"),
  body("role")
    .optional()
    .isIn(["owner", "admin", "member", "viewer"])
    .withMessage("Invalid role"),
];
