/**
 * Add Workspace Member Validation
 */

import { body } from "express-validator";

export const addWorkspaceMemberValidation = [
  body("userId").optional().isMongoId().withMessage("Invalid user ID"),
  body("email").optional().isEmail().withMessage("Invalid email address"),
  body("role")
    .optional()
    .isIn(["owner", "admin", "member", "viewer"])
    .withMessage("Invalid role"),
];
